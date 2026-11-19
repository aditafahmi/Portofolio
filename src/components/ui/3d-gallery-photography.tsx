import React, {
  Suspense,
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export type ImageItem =
  | string
  | { src: string; alt?: string; projectId?: string };

export interface FadeSettings {
  fadeIn: { start: number; end: number };
  fadeOut: { start: number; end: number };
}

export interface BlurSettings {
  blurIn: { start: number; end: number };
  blurOut: { start: number; end: number };
  maxBlur: number;
}

export interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  zSpacing?: number;
  visibleCount?: number;
  falloff?: { near: number; far: number };
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  monochrome?: boolean;
  captureWheel?: boolean;
  onSelectImage?: (imageIndex: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 10.2;
const MAX_VERTICAL_OFFSET = 6.8;

const createClothMaterial = (monochrome = true) => {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
      uMonochrome: { value: monochrome ? 1.0 : 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;

        vec3 pos = position;

        // Smooth curving based on scroll velocity
        float curveIntensity = clamp(scrollForce, -4.0, 4.0) * 0.28;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        // Gentle cloth-like ripples
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        // Subtle flag wave on hover
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 7.0;
          float waveAmplitude = sin(wavePhase) * 0.08;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          float secondaryWave = sin(pos.x * 5.0 + time * 10.5) * 0.025 * dampening;
          flagWave += secondaryWave;
        }

        pos.z -= (curve + clothEffect + flagWave);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      uniform float isHovered;
      uniform float uMonochrome;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vec4 color = texture2D(map, vUv);

        if (blurAmount > 0.01) {
          vec2 texelSize = vec2(1.0 / 1024.0);
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount * 1.4;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, clamp(vUv + offset, 0.002, 0.998)) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        // Filmic silver-gelatin monochrome grading to unify all floating plates
        if (uMonochrome > 0.5) {
          float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          // Subtle editorial S-curve contrast and controlled highlights
          lum = clamp((lum - 0.5) * 1.14 + 0.48, 0.0, 1.0);
          float brightness = mix(0.76, 0.92, isHovered);
          // Warm archival paper tint matching #F2EFE9
          color.rgb = vec3(lum * brightness) * vec3(1.0, 0.992, 0.975);
        }

        float curveHighlight = abs(scrollForce) * 0.035;
        color.rgb += vec3(curveHighlight * 0.06);

        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
};

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 10,
  monochrome = true,
  captureWheel = false,
  onSelectImage,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.72, end: 0.92 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.14 },
    blurOut: { start: 0.78, end: 0.96 },
    maxBlur: 5.0,
  },
}: Omit<InfiniteGalleryProps, "className" | "style">) {
  const scrollVelocityRef = useRef(0);
  const autoPlayRef = useRef(true);
  const lastInteractionRef = useRef(Date.now());
  const hoveredIndexRef = useRef<number | null>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string" ? { src: img, alt: "" } : img
      ),
    [images]
  );

  const textures = useTexture(normalizedImages.map((img) => img.src));

  useEffect(() => {
    textures.forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
      }
    });
  }, [textures]);

  const materials = useMemo(
    () =>
      Array.from({ length: visibleCount }, () => createClothMaterial(monochrome)),
    [visibleCount, monochrome]
  );

  useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose());
    };
  }, [materials]);

  const spatialPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < visibleCount; i++) {
      // Distribute around a balanced architectural corridor so plates frame the
      // centered typography instead of stacking directly on top of the title.
      const angle = (i * 2.39996 + 0.45) % (Math.PI * 2);
      const radialTier = 0.78 + (i % 3) * 0.28;
      let x = Math.cos(angle) * radialTier * (MAX_HORIZONTAL_OFFSET * 0.56);
      let y = Math.sin(angle) * radialTier * (MAX_VERTICAL_OFFSET * 0.52);

      // Push planes gently out of the central title band (|x| < 2.2 && |y| < 1.35)
      if (Math.abs(x) < 2.2 && Math.abs(y) < 1.35) {
        x += x >= 0 ? 2.1 : -2.1;
        y += y >= 0 ? 0.9 : -0.9;
      }

      positions.push({ x, y });
    }
    return positions;
  }, [visibleCount]);

  const totalImages = normalizedImages.length;
  const depthRange = DEFAULT_DEPTH_RANGE;

  const planesData = useRef<PlaneData[]>(
    Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }))
  );

  useEffect(() => {
    planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z:
        visibleCount > 0
          ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange
          : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }));
  }, [depthRange, spatialPositions, totalImages, visibleCount]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (captureWheel) {
        event.preventDefault();
      }
      scrollVelocityRef.current += event.deltaY * 0.0085 * speed;
      autoPlayRef.current = false;
      lastInteractionRef.current = Date.now();
    },
    [captureWheel, speed]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        scrollVelocityRef.current -= 1.8 * speed;
        autoPlayRef.current = false;
        lastInteractionRef.current = Date.now();
      } else if (event.key === "ArrowRight") {
        scrollVelocityRef.current += 1.8 * speed;
        autoPlayRef.current = false;
        lastInteractionRef.current = Date.now();
      } else if (captureWheel && event.key === "ArrowUp") {
        event.preventDefault();
        scrollVelocityRef.current -= 1.8 * speed;
        autoPlayRef.current = false;
        lastInteractionRef.current = Date.now();
      } else if (captureWheel && event.key === "ArrowDown") {
        event.preventDefault();
        scrollVelocityRef.current += 1.8 * speed;
        autoPlayRef.current = false;
        lastInteractionRef.current = Date.now();
      }
    },
    [captureWheel, speed]
  );

  useEffect(() => {
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - y;
      touchStartY = y;
      scrollVelocityRef.current += dy * 0.03 * speed;
      autoPlayRef.current = false;
      lastInteractionRef.current = Date.now();
    };

    window.addEventListener("wheel", handleWheel, { passive: !captureWheel });
    window.addEventListener("keydown", handleKeyDown);
    if (captureWheel) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (captureWheel) {
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
      }
    };
  }, [captureWheel, handleWheel, handleKeyDown, speed]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (Date.now() - lastInteractionRef.current > 2800) {
      autoPlayRef.current = true;
    }

    if (autoPlayRef.current) {
      scrollVelocityRef.current += 0.24 * speed * delta;
    }

    // Smooth velocity damping
    scrollVelocityRef.current *= Math.pow(0.94, delta * 60);

    const time = state.clock.getElapsedTime();
    const imageAdvance =
      totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
    const totalRange = depthRange;
    const halfRange = totalRange / 2;

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocityRef.current * delta * 9.5;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= totalRange) {
        wrapsForward = Math.floor(newZ / totalRange);
        newZ -= totalRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / totalRange);
        newZ += totalRange * wrapsBackward;
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
        plane.imageIndex =
          (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }
      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % totalRange) + totalRange) % totalRange;
      const worldZ = plane.z - halfRange;

      // Update Three.js mesh transform directly (60fps, zero React re-render overhead)
      const mesh = meshRefs.current[i];
      const tex = textures[plane.imageIndex];
      const material = materials[i];

      if (mesh && tex) {
        mesh.position.set(plane.x, plane.y, worldZ);
        const aspect =
          tex.image && tex.image.height
            ? tex.image.width / tex.image.height
            : 1.33;
        const baseScale = 2.05;
        if (aspect > 1) {
          mesh.scale.set(baseScale * aspect, baseScale, 1);
        } else {
          mesh.scale.set(baseScale, baseScale / aspect, 1);
        }
      }

      if (material && material.uniforms && tex) {
        const normalizedPosition = plane.z / totalRange;
        let opacity = 1;

        if (
          normalizedPosition >= fadeSettings.fadeIn.start &&
          normalizedPosition <= fadeSettings.fadeIn.end
        ) {
          opacity =
            (normalizedPosition - fadeSettings.fadeIn.start) /
            (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
        } else if (normalizedPosition < fadeSettings.fadeIn.start) {
          opacity = 0;
        } else if (
          normalizedPosition >= fadeSettings.fadeOut.start &&
          normalizedPosition <= fadeSettings.fadeOut.end
        ) {
          opacity =
            1 -
            (normalizedPosition - fadeSettings.fadeOut.start) /
              (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
        } else if (normalizedPosition > fadeSettings.fadeOut.end) {
          opacity = 0;
        }

        opacity = Math.max(0, Math.min(1, opacity));

        let blur = 0;
        if (
          normalizedPosition >= blurSettings.blurIn.start &&
          normalizedPosition <= blurSettings.blurIn.end
        ) {
          blur =
            blurSettings.maxBlur *
            (1 -
              (normalizedPosition - blurSettings.blurIn.start) /
                (blurSettings.blurIn.end - blurSettings.blurIn.start));
        } else if (normalizedPosition < blurSettings.blurIn.start) {
          blur = blurSettings.maxBlur;
        } else if (
          normalizedPosition >= blurSettings.blurOut.start &&
          normalizedPosition <= blurSettings.blurOut.end
        ) {
          blur =
            blurSettings.maxBlur *
            ((normalizedPosition - blurSettings.blurOut.start) /
              (blurSettings.blurOut.end - blurSettings.blurOut.start));
        } else if (normalizedPosition > blurSettings.blurOut.end) {
          blur = blurSettings.maxBlur;
        }

        blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

        material.uniforms.map.value = tex;
        material.uniforms.time.value = time;
        material.uniforms.scrollForce.value = scrollVelocityRef.current;
        material.uniforms.opacity.value = opacity;
        material.uniforms.blurAmount.value = blur;
        material.uniforms.isHovered.value =
          hoveredIndexRef.current === i ? 1.0 : 0.0;
      }
    });
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => (
        <mesh
          key={plane.index}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={[plane.x, plane.y, plane.z - depthRange / 2]}
          material={materials[i]}
          onPointerEnter={(e) => {
            e.stopPropagation();
            hoveredIndexRef.current = i;
            document.body.style.cursor = onSelectImage ? "pointer" : "default";
          }}
          onPointerLeave={() => {
            if (hoveredIndexRef.current === i) hoveredIndexRef.current = null;
            document.body.style.cursor = "default";
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectImage) {
              onSelectImage(planesData.current[i]?.imageIndex ?? 0);
            }
          }}
        >
          <planeGeometry args={[1, 1, 32, 32]} />
        </mesh>
      ))}
    </>
  );
}

function FallbackGallery({ images }: { images: ImageItem[] }) {
  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string" ? { src: img, alt: "" } : img
      ),
    [images]
  );

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#070707] p-8">
      <div className="grid max-w-5xl grid-cols-2 gap-4 opacity-50 md:grid-cols-4">
        {normalizedImages.slice(0, 8).map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            className="h-40 w-full object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export default function InfiniteGallery({
  images,
  speed = 1.1,
  zSpacing = 3,
  visibleCount = 10,
  falloff,
  monochrome = true,
  captureWheel = false,
  onSelectImage,
  className = "h-screen w-full",
  style,
  fadeSettings = {
    fadeIn: { start: 0.04, end: 0.24 },
    fadeOut: { start: 0.66, end: 0.86 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.14 },
    blurOut: { start: 0.7, end: 0.9 },
    maxBlur: 5.0,
  },
}: InfiniteGalleryProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        <FallbackGallery images={images} />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 14], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <GalleryScene
            images={images}
            speed={speed}
            zSpacing={zSpacing}
            visibleCount={visibleCount}
            falloff={falloff}
            monochrome={monochrome}
            captureWheel={captureWheel}
            onSelectImage={onSelectImage}
            fadeSettings={fadeSettings}
            blurSettings={blurSettings}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
