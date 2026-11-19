import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GallerySlide } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface LightboxProps {
  slides: GallerySlide[];
  index: number;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}

export default function Lightbox({
  slides,
  index,
  onClose,
  onChangeIndex,
}: LightboxProps) {
  const current = slides[index];
  const hasMultiple = slides.length > 1;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowLeft") {
        onChangeIndex((index - 1 + slides.length) % slides.length);
      }
      if (hasMultiple && e.key === "ArrowRight") {
        onChangeIndex((index + 1) % slides.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasMultiple, index, onChangeIndex, onClose, slides.length]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#050505]/95 p-6 backdrop-blur-md md:p-14"
      role="dialog"
      aria-modal="true"
      aria-label="Full resolution plate viewer"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className="fixed right-6 top-6 z-10 flex h-11 w-11 items-center justify-center border border-bone/15 bg-obsidian/80 text-bone/80 transition hover:border-bone/50 hover:text-bone"
      >
        <X className="h-5 w-5" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChangeIndex((index - 1 + slides.length) % slides.length);
            }}
            aria-label="Previous plate"
            className="fixed left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-bone/15 bg-obsidian/80 text-bone/80 transition hover:border-bone/50 hover:text-bone md:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChangeIndex((index + 1) % slides.length);
            }}
            aria-label="Next plate"
            className="fixed right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-bone/15 bg-obsidian/80 text-bone/80 transition hover:border-bone/50 hover:text-bone md:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <figure
        className="flex w-full max-w-6xl flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "flex max-h-[calc(100vh-160px)] items-center justify-center overflow-hidden border border-bone/10",
            current.lightPlate ? "bg-[#efede8] p-4 md:p-7" : "bg-[#0a0a0a]"
          )}
        >
          <img
            src={current.src}
            alt={current.caption}
            className="max-h-[calc(100vh-200px)] w-auto max-w-full object-contain"
          />
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 pt-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
              {current.badge}
            </span>
            <span className="text-bone/30">/</span>
            <span className="text-bone/85">{current.caption}</span>
          </div>
          <span className="font-mono text-[11px] tracking-[0.14em] text-stone">
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
