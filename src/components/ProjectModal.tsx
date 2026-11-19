import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import type { GallerySlide, Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenLightbox: (slides: GallerySlide[], startIndex: number) => void;
}

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
  onOpenLightbox,
}: ProjectModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"gallery" | "compare">("gallery");

  useEffect(() => {
    setSlideIndex(0);
    setViewMode("gallery");
  }, [project.id]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const activeSlide = project.gallery[slideIndex] ?? project.gallery[0];

  const handleOpenCompareLightbox = (side: 0 | 1) => {
    if (!project.comparePair) return;
    onOpenLightbox(
      [
        {
          src: project.comparePair.left.src,
          badge: "Architectural View",
          caption: `${project.title} — ${project.comparePair.left.label}`,
          lightPlate: project.comparePair.left.lightPlate,
        },
        {
          src: project.comparePair.right.src,
          badge: "Analytical Model",
          caption: `${project.title} — ${project.comparePair.right.label}`,
          lightPlate: project.comparePair.right.lightPlate,
        },
      ],
      side
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bone/40 p-3 backdrop-blur-md md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100vh-24px)] w-full max-w-5xl flex-col overflow-hidden border border-bone/15 bg-obsidian text-bone shadow-2xl md:max-h-[calc(100vh-64px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Editorial Top Bar */}
        <div className="flex items-center justify-between border-b border-bone/10 px-6 py-4 md:px-10">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
            <span>No. {project.number}</span>
            <span className="text-bone/25">/</span>
            <span>{project.category}</span>
            <span className="hidden text-bone/25 sm:inline">/</span>
            <span className="hidden sm:inline">{project.location}</span>
            <span className="text-bone/25">/</span>
            <span>{project.year}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous project"
              className="flex h-8 items-center gap-1.5 border border-bone/10 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-stone transition hover:border-bone/40 hover:text-bone"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next project"
              className="flex h-8 items-center gap-1.5 border border-bone/10 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-stone transition hover:border-bone/40 hover:text-bone"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="ml-1 flex h-8 w-8 items-center justify-center border border-bone/10 text-stone transition hover:border-bone/40 hover:text-bone"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Editorial Body */}
        <div className="overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          {/* Header */}
          <div className="mb-8 max-w-3xl">
            <h2
              id="case-study-title"
              className="font-serif text-3xl font-normal tracking-tight text-bone md:text-5xl"
            >
              {project.title}
            </h2>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
              {project.role}
            </p>
            <p className="mt-5 text-base leading-relaxed text-bone/80">
              {project.summary}
            </p>
          </div>

          {/* Gallery / Render vs. Structure Switcher */}
          <div className="mb-10">
            {project.comparePair && (
              <div className="mb-4 flex items-center justify-between border-b border-bone/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                  Visual Plates
                </span>
                <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.16em]">
                  <button
                    type="button"
                    onClick={() => setViewMode("gallery")}
                    className={cn(
                      "pb-1 transition",
                      viewMode === "gallery"
                        ? "border-b border-bone text-bone"
                        : "text-stone hover:text-bone"
                    )}
                  >
                    Plates ({project.gallery.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("compare")}
                    className={cn(
                      "pb-1 transition",
                      viewMode === "compare"
                        ? "border-b border-bone text-bone"
                        : "text-stone hover:text-bone"
                    )}
                  >
                    Render vs. Structure
                  </button>
                </div>
              </div>
            )}

            {viewMode === "gallery" && activeSlide && (
              <div>
                <div
                  onClick={() => onOpenLightbox(project.gallery, slideIndex)}
                  className={cn(
                    "group relative aspect-[16/9.5] w-full cursor-zoom-in overflow-hidden border border-bone/10",
                    activeSlide.lightPlate ? "bg-[#ffffff] p-4 md:p-7" : "bg-[#eceae3]"
                  )}
                >
                  <img
                    src={activeSlide.src}
                    alt={activeSlide.caption}
                    className={cn(
                      "h-full w-full transition duration-500 group-hover:scale-[1.015]",
                      activeSlide.lightPlate ? "object-contain" : "object-cover"
                    )}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-obsidian/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/90 backdrop-blur-sm">
                    <Maximize2 className="h-3 w-3" />
                    <span>Inspect</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone">
                  <span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/70">
                      {activeSlide.badge}
                    </span>
                    <span className="mx-2 text-bone/25">—</span>
                    {activeSlide.caption}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.15em]">
                    {String(slideIndex + 1).padStart(2, "0")} /{" "}
                    {String(project.gallery.length).padStart(2, "0")}
                  </span>
                </div>

                {project.gallery.length > 1 && (
                  <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1">
                    {project.gallery.map((slide, idx) => (
                      <button
                        key={slide.src}
                        type="button"
                        onClick={() => setSlideIndex(idx)}
                        aria-label={`View plate ${idx + 1}: ${slide.caption}`}
                        className={cn(
                          "h-16 w-28 shrink-0 overflow-hidden border transition",
                          slide.lightPlate ? "bg-[#ffffff] p-1" : "bg-[#eceae3]",
                          idx === slideIndex
                            ? "border-bone opacity-100"
                            : "border-bone/10 opacity-45 hover:opacity-85"
                        )}
                      >
                        <img
                          src={slide.src}
                          alt=""
                          className={cn(
                            "h-full w-full",
                            slide.lightPlate ? "object-contain" : "object-cover"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === "compare" && project.comparePair && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[project.comparePair.left, project.comparePair.right].map(
                  (pane, sideIdx) => (
                    <div key={pane.src} className="flex flex-col gap-2">
                      <div
                        onClick={() =>
                          handleOpenCompareLightbox(sideIdx as 0 | 1)
                        }
                        className={cn(
                          "group relative aspect-[16/10.5] cursor-zoom-in overflow-hidden border border-bone/10",
                          pane.lightPlate ? "bg-[#ffffff] p-4" : "bg-[#eceae3]"
                        )}
                      >
                        <img
                          src={pane.src}
                          alt={pane.label}
                          className={cn(
                            "h-full w-full transition duration-500 group-hover:scale-[1.02]",
                            pane.lightPlate ? "object-contain" : "object-cover"
                          )}
                        />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                        {pane.label}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Hairline Specs Ledger */}
          <div className="mb-10 grid grid-cols-2 gap-6 border-y border-bone/10 py-6 md:grid-cols-4">
            {project.specs.map((spec) => (
              <div key={spec.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  {spec.label}
                </div>
                <div className="mt-1.5 text-sm font-medium text-bone">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          {/* Editorial Narrative Columns */}
          <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                I. Challenge
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bone/80">
                {project.challenge}
              </p>
            </div>
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                II. Approach
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bone/80">
                {project.approach}
              </p>
            </div>
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                III. Outcome
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bone/80">
                {project.result}
              </p>
            </div>
          </div>

          {/* Key Impact Quote */}
          <blockquote className="mb-8 border-l border-bone/30 pl-5 font-serif text-xl italic leading-snug text-bone/90 md:text-2xl">
            {project.impact}
          </blockquote>

          {/* Colophon: Software & Codes */}
          <div className="grid grid-cols-1 gap-6 border-t border-bone/10 pt-6 md:grid-cols-2">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                Analytical Software
              </div>
              <p className="mt-2 text-sm text-bone/80">
                {project.software.join(" · ")}
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                Governing Codes &amp; Standards
              </div>
              <p className="mt-2 text-sm text-bone/80">
                {project.codes.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
