import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Expand,
  Grid2x2,
  List,
  Menu,
  X,
} from "lucide-react";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import ProjectModal from "@/components/ProjectModal";
import Lightbox from "@/components/Lightbox";
import {
  PORTFOLIO,
  type GallerySlide,
  type Project,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";

export default function App() {
  const { profile, heroGalleryImages, highlights, projects, moreProjectsVisual, moreProjectsRegister, experiences, skills, credentials } = PORTFOLIO;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exhibitionMode, setExhibitionMode] = useState(false);

  // Profile photography toggle
  const [portraitMode, setPortraitMode] = useState<"field" | "executive">("field");

  // Works filter & editorial view mode
  const [activeCategory, setActiveCategory] = useState("All");
  const [worksView, setWorksView] = useState<"gallery" | "index">("gallery");
  const [hoveredIndexProject, setHoveredIndexProject] = useState<Project>(projects[0]);

  // Modals
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [lightboxState, setLightboxState] = useState<{
    slides: GallerySlide[];
    index: number;
  } | null>(null);

  // Contact state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sender, setSender] = useState("");
  const [topic, setTopic] = useState("Senior Structural Role");
  const [message, setMessage] = useState("");

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const locked = Boolean(activeProjectId || lightboxState || exhibitionMode);
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProjectId, lightboxState, exhibitionMode]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return [
      { label: "All", count: projects.length },
      ...Object.entries(counts).map(([label, count]) => ({ label, count })),
    ];
  }, [projects]);

  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [activeCategory, projects]
  );

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [activeProjectId, projects]
  );

  const stepProject = (delta: number) => {
    if (!activeProjectId) return;
    const idx = projects.findIndex((p) => p.id === activeProjectId);
    if (idx === -1) return;
    const nextIdx = (idx + delta + projects.length) % projects.length;
    setActiveProjectId(projects[nextIdx].id);
  };

  const handleSelectHeroImage = (imageIndex: number) => {
    const chosen = heroGalleryImages[imageIndex];
    if (chosen && chosen.projectId) {
      setExhibitionMode(false);
      setActiveProjectId(chosen.projectId);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      showToast(`Copied ${profile.email}`);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      showToast(profile.email);
    }
  };

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `[Portfolio Inquiry] ${topic}${sender ? ` — ${sender}` : ""}`;
    const body = `Hello Adita,\n\nFrom: ${sender || "(Not specified)"}\nTopic: ${topic}\n\n${message}\n`;
    window.location.href = `mailto:${encodeURIComponent(
      profile.email
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast("Opening email draft...");
  };

  const handleOpenMoreLightbox = (idx: number) => {
    const item = moreProjectsVisual[idx];
    if (!item) return;
    if (item.extraSlides && item.extraSlides.length > 0) {
      setLightboxState({
        slides: [
          {
            src: item.image,
            badge: item.badge,
            caption: `${item.title} (${item.location}) — ${item.note}`,
            lightPlate: item.lightPlate,
          },
          ...item.extraSlides,
        ],
        index: 0,
      });
    } else {
      setLightboxState({
        slides: moreProjectsVisual.map((m) => ({
          src: m.image,
          badge: m.badge,
          caption: `${m.title} (${m.location}) — ${m.note}`,
          lightPlate: m.lightPlate,
        })),
        index: idx,
      });
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-bone selection:bg-bone selection:text-obsidian">
      {/* MINIMALIST FLOATING HEADER */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-bone/10 bg-obsidian/80 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1380px] items-center justify-between px-6 md:px-12">
          <a
            href="#top"
            onClick={() => setExhibitionMode(false)}
            className="font-serif text-xl tracking-tight text-bone transition hover:opacity-80 md:text-2xl"
          >
            <span className="italic">Adita</span> Fahmi Hanif
          </a>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
            {[
              { href: "#works", label: "Works" },
              { href: "#profile", label: "Profile" },
              { href: "#archive", label: "Archive" },
              { href: "#practice", label: "Practice" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setExhibitionMode(false)}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/70 transition hover:text-bone"
              >
                {item.label}
              </a>
            ))}
            <a
              href={encodeURI(profile.cvUrl)}
              download={profile.cvFileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-bone/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition hover:border-bone hover:bg-bone hover:text-obsidian"
            >
              <span>Resume</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center border border-bone/15 text-bone md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-bone/10 bg-obsidian/95 px-6 pb-8 pt-4 backdrop-blur-lg md:hidden">
            <div className="flex flex-col gap-5">
              {[
                { href: "#works", label: "Works" },
                { href: "#profile", label: "Profile" },
                { href: "#archive", label: "Archive" },
                { href: "#practice", label: "Practice" },
                { href: "#contact", label: "Contact" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setExhibitionMode(false);
                    setMobileMenuOpen(false);
                  }}
                  className="font-serif text-3xl text-bone/90"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={encodeURI(profile.cvUrl)}
                download={profile.cvFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit items-center gap-2 border border-bone/25 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone"
              >
                <span>Download Resume (PDF)</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          HERO: 3D INFINITE PHOTOGRAPHY & ARCHITECTURAL GALLERY (21st.dev)
         ===================================================================== */}
      <section
        id="top"
        className={cn(
          "relative w-full overflow-hidden bg-obsidian",
          exhibitionMode ? "fixed inset-0 z-40 h-screen" : "h-screen min-h-[680px]"
        )}
      >
        <InfiniteGallery
          images={heroGalleryImages}
          speed={1.15}
          zSpacing={3}
          visibleCount={12}
          monochrome
          captureWheel={exhibitionMode}
          onSelectImage={handleSelectHeroImage}
          className="h-full w-full"
        />

        {/* Subtle editorial vignette + soft center readability veil */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 52% 36% at 50% 50%, rgba(7,7,7,0.72) 0%, rgba(7,7,7,0.34) 58%, rgba(7,7,7,0.12) 82%, rgba(7,7,7,0.78) 100%)",
          }}
        />

        {/* Monumental Centered Editorial Typography — crisp contrast at all zoom depths */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.34em] text-bone/90 md:text-[11px]"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.95)" }}
          >
            {profile.role} · {profile.location}
          </p>
          <h1
            className="font-serif text-5xl font-light tracking-tight text-[#faf8f4] sm:text-7xl md:text-[6.25rem] md:leading-[0.95]"
            style={{ textShadow: "0 4px 36px rgba(0,0,0,0.92), 0 2px 10px rgba(0,0,0,0.85)" }}
          >
            <span className="italic">Adita Fahmi</span> Hanif
          </h1>
          <p
            className="mt-6 max-w-xl font-mono text-[10px] uppercase tracking-[0.26em] text-bone/90 md:text-[11px]"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.95)" }}
          >
            Data Centers · Seismic Design · Retrofit &amp; Forensics
          </p>
        </div>

        {/* Quiet Bottom Exhibition Controls */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-bone/10 bg-gradient-to-t from-obsidian/90 via-obsidian/50 to-transparent">
          <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-12">
            <button
              type="button"
              onClick={() => setExhibitionMode((v) => !v)}
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/80 transition hover:text-bone"
            >
              <Expand className="h-3.5 w-3.5" />
              <span>
                {exhibitionMode
                  ? "Exit 3D Exhibition"
                  : "Lock 3D Exhibition Mode"}
              </span>
            </button>

            <p className="hidden text-center font-mono text-[10px] uppercase tracking-[0.22em] text-stone lg:block">
              {exhibitionMode
                ? "Scroll wheel, arrow keys, or swipe to navigate · Click any frame to inspect"
                : "Scroll or ← → to drift · Click any floating work to open case study"}
            </p>

            {exhibitionMode ? (
              <button
                type="button"
                onClick={() => setExhibitionMode(false)}
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition hover:opacity-75"
              >
                <span>Return to Monograph</span>
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <a
                href="#profile"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/85 transition hover:text-bone"
              >
                <span>Enter Monograph</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          EDITORIAL STATEMENT & PROFILE
         ===================================================================== */}
      <section id="profile" className="border-t border-bone/10 py-28 md:py-40">
        <div className="mx-auto max-w-[1380px] px-6 md:px-12">
          <div className="mb-10 font-mono text-[10px] uppercase tracking-[0.28em] text-stone">
            Statement &amp; Profile
          </div>

          <h2 className="max-w-5xl font-serif text-3xl font-light leading-[1.15] tracking-tight text-bone sm:text-5xl md:text-[3.75rem]">
            “{profile.tagline}”
          </h2>

          {/* Editorial Typographic Figures (No Boxes) */}
          <div className="mt-16 grid grid-cols-2 gap-y-10 border-y border-bone/10 py-10 md:mt-24 md:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.label} className="pr-6">
                <div className="font-serif text-4xl font-light tracking-tight text-bone md:text-5xl">
                  {item.value}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Asymmetric Editorial Biography + Monochrome Photography */}
          <div className="mt-20 grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
            <div className="space-y-7 lg:col-span-6 lg:pr-8">
              {profile.about.map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-[1.85] text-bone/75 md:text-[17px]"
                >
                  {para}
                </p>
              ))}

              <div className="border-t border-bone/10 pt-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
                  Availability
                </div>
                <p className="mt-2 font-serif text-2xl italic text-bone">
                  {profile.availability}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em]">
                  <a
                    href="#contact"
                    className="border-b border-bone pb-1 text-bone transition hover:opacity-70"
                  >
                    Start a Conversation
                  </a>
                  <a
                    href={encodeURI(profile.cvUrl)}
                    download={profile.cvFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-stone transition hover:text-bone"
                  >
                    <span>Download Resume (PDF)</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="overflow-hidden bg-[#0e0e0e]">
                <img
                  src={
                    portraitMode === "field"
                      ? profile.media.fieldPortrait
                      : profile.media.executivePortrait
                  }
                  alt={
                    portraitMode === "field"
                      ? "Adita Fahmi Hanif on structural construction site"
                      : "Adita Fahmi Hanif executive portrait in Jakarta"
                  }
                  className="aspect-[4/3.3] w-full object-cover object-[center_22%] grayscale transition duration-700"
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-bone/10 pt-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                  {portraitMode === "field"
                    ? "Field Inspection — Reinforced Concrete Construction"
                    : "Jakarta — Structural Engineering Leadership"}
                </span>

                <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <button
                    type="button"
                    onClick={() => setPortraitMode("field")}
                    className={cn(
                      "transition",
                      portraitMode === "field"
                        ? "border-b border-bone pb-0.5 text-bone"
                        : "text-stone hover:text-bone"
                    )}
                  >
                    Field
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortraitMode("executive")}
                    className={cn(
                      "transition",
                      portraitMode === "executive"
                        ? "border-b border-bone pb-0.5 text-bone"
                        : "text-stone hover:text-bone"
                    )}
                  >
                    Portrait
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SELECTED WORKS (GALLERY / INDEX DUAL-MODE EXHIBITION)
         ===================================================================== */}
      <section id="works" className="border-t border-bone/10 py-28 md:py-36">
        <div className="mx-auto max-w-[1380px] px-6 md:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-stone">
                Selected Works · 2013—2026
              </div>
              <h2 className="mt-3 font-serif text-4xl font-light tracking-tight text-bone md:text-6xl">
                Featured <span className="italic">Monograph</span>
              </h2>
            </div>

            {/* View Toggle: Gallery vs Index */}
            <div className="flex items-center gap-5 border-b border-bone/10 pb-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              <button
                type="button"
                onClick={() => setWorksView("gallery")}
                className={cn(
                  "inline-flex items-center gap-2 pb-1 transition",
                  worksView === "gallery"
                    ? "text-bone"
                    : "text-stone hover:text-bone"
                )}
              >
                <Grid2x2 className="h-3.5 w-3.5" />
                <span>Gallery</span>
              </button>
              <button
                type="button"
                onClick={() => setWorksView("index")}
                className={cn(
                  "inline-flex items-center gap-2 pb-1 transition",
                  worksView === "index"
                    ? "text-bone"
                    : "text-stone hover:text-bone"
                )}
              >
                <List className="h-3.5 w-3.5" />
                <span>Index</span>
              </button>
            </div>
          </div>

          {/* Quiet Editorial Filter Bar */}
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-bone/10 py-4">
            {categories.map((cat) => {
              const active = cat.label === activeCategory;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveCategory(cat.label)}
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.18em] transition",
                    active
                      ? "border-b border-bone pb-0.5 text-bone"
                      : "text-stone hover:text-bone"
                  )}
                >
                  {cat.label}
                  <span className="ml-1.5 text-[10px] opacity-55">
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* VIEW 1: EDITORIAL GALLERY */}
          {worksView === "gallery" && (
            <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2">
              {filteredProjects.map((project, idx) => (
                <article
                  key={project.id}
                  onClick={() => setActiveProjectId(project.id)}
                  className={cn(
                    "group cursor-pointer",
                    idx % 2 === 1 && "md:mt-16"
                  )}
                >
                  <div
                    className={cn(
                      "relative aspect-[16/10.5] w-full overflow-hidden",
                      project.coverLightPlate
                        ? "bg-[#efede8] p-6"
                        : "bg-[#111111]"
                    )}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className={cn(
                        "h-full w-full transition duration-700 ease-out group-hover:scale-[1.035]",
                        project.coverLightPlate
                          ? "object-contain"
                          : "object-cover"
                      )}
                    />
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-bone/10 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                    <span>
                      {project.number} / {project.category}
                    </span>
                    <span>
                      {project.location} · {project.year}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <h3 className="font-serif text-2xl font-normal tracking-tight text-bone transition group-hover:opacity-75 md:text-3xl">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="mt-1.5 h-5 w-5 shrink-0 text-stone transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" />
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-stone">
                    {project.summary}
                  </p>

                  <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/60">
                    {project.gallery.length} Plates
                    {project.comparePair ? " · Render vs. Structure" : ""}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* VIEW 2: PHOTOGRAPHER / MUSICIAN INDEX LIST WITH HOVER PREVIEW */}
          {worksView === "index" && (
            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="divide-y divide-bone/10 border-b border-bone/10 lg:col-span-8">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onMouseEnter={() => setHoveredIndexProject(project)}
                    onFocus={() => setHoveredIndexProject(project)}
                    onClick={() => setActiveProjectId(project.id)}
                    className="group grid w-full grid-cols-12 items-baseline gap-4 py-6 text-left transition hover:bg-bone/[0.025]"
                  >
                    <span className="col-span-2 font-mono text-[11px] text-stone sm:col-span-1">
                      {project.number}
                    </span>
                    <span className="col-span-10 font-serif text-2xl text-bone transition group-hover:translate-x-1 sm:col-span-6 md:text-3xl">
                      {project.title}
                    </span>
                    <span className="col-span-6 col-start-3 font-mono text-[10px] uppercase tracking-[0.16em] text-stone sm:col-span-3 sm:col-start-auto">
                      {project.category}
                    </span>
                    <span className="col-span-4 text-right font-mono text-[11px] text-stone sm:col-span-2">
                      {project.year}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sticky Preview Plate on Desktop */}
              <div className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-28">
                  {hoveredIndexProject && (
                    <div
                      onClick={() => setActiveProjectId(hoveredIndexProject.id)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "aspect-[4/3] overflow-hidden border border-bone/10",
                          hoveredIndexProject.coverLightPlate
                            ? "bg-[#efede8] p-4"
                            : "bg-[#111111]"
                        )}
                      >
                        <img
                          src={hoveredIndexProject.image}
                          alt={hoveredIndexProject.title}
                          className={cn(
                            "h-full w-full transition duration-500",
                            hoveredIndexProject.coverLightPlate
                              ? "object-contain"
                              : "object-cover"
                          )}
                        />
                      </div>
                      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                        {hoveredIndexProject.location} · {hoveredIndexProject.year}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-bone/75">
                        {hoveredIndexProject.impact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          EXTENDED ARCHIVE
         ===================================================================== */}
      <section id="archive" className="border-t border-bone/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1380px] px-6 md:px-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-stone">
                Extended Archive
              </div>
              <h2 className="mt-3 font-serif text-3xl font-light text-bone md:text-5xl">
                Additional <span className="italic">Plates &amp; Commissions</span>
              </h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
              Click any plate to inspect full resolution
            </p>
          </div>

          {/* 5 Visual Plates */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {moreProjectsVisual.map((item, idx) => (
              <button
                key={item.title}
                type="button"
                onClick={() => handleOpenMoreLightbox(idx)}
                className="group flex flex-col text-left"
              >
                <div
                  className={cn(
                    "aspect-[4/3] w-full overflow-hidden border border-bone/10",
                    item.lightPlate ? "bg-[#efede8] p-3" : "bg-[#111111]"
                  )}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className={cn(
                      "h-full w-full transition duration-500 group-hover:scale-[1.04]",
                      item.lightPlate ? "object-contain" : "object-cover"
                    )}
                  />
                </div>
                <span className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-stone">
                  {item.badge}
                </span>
                <span className="mt-1 font-serif text-xl text-bone transition group-hover:opacity-75">
                  {item.title}
                </span>
                <span className="mt-0.5 text-xs text-stone">{item.location}</span>
              </button>
            ))}
          </div>

          {/* Minimal Typographic Register */}
          <div className="mt-16 border-t border-bone/10 pt-10">
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.24em] text-stone">
              Other Completed Assignments
            </div>
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              {moreProjectsRegister.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-bone/10 pb-4"
                >
                  <div className="text-sm font-medium text-bone/90">
                    {item.title}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                    {item.location} · {item.scope}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PRACTICE: CHRONOLOGY, CAPABILITIES & CREDENTIALS
         ===================================================================== */}
      <section id="practice" className="border-t border-bone/10 py-28 md:py-36">
        <div className="mx-auto max-w-[1380px] px-6 md:px-12">
          {/* Chronology */}
          <div className="mb-24">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-stone">
              Chronology · 2012—Present
            </div>
            <h2 className="mt-3 font-serif text-4xl font-light text-bone md:text-6xl">
              Fourteen Years in <span className="italic">Practice</span>
            </h2>

            <div className="mt-12 divide-y divide-bone/10 border-y border-bone/10">
              {experiences.map((exp) => (
                <div
                  key={`${exp.organization}-${exp.period}`}
                  className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:gap-8"
                >
                  <div className="font-mono text-xs tracking-[0.12em] text-stone md:col-span-2">
                    {exp.period}
                  </div>
                  <div className="md:col-span-4">
                    <div className="font-serif text-2xl text-bone">
                      {exp.organization}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                      {exp.title}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-bone/75 md:col-span-6">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities & Design Codes */}
          <div className="mb-24">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-stone">
              Capabilities &amp; Codes
            </div>
            <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-3">
              {skills.map((group) => (
                <div key={group.group} className="border-t border-bone/20 pt-6">
                  <h3 className="font-serif text-2xl text-bone">
                    {group.group}
                  </h3>
                  <ul className="mt-5 space-y-2.5 text-sm text-bone/75">
                    {group.items.map((item) => (
                      <li key={item} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Quiet Automation Editorial Note */}
            <div className="mt-14 grid grid-cols-1 items-center gap-8 border-y border-bone/10 py-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone">
                  In-House Engineering Automation
                </div>
                <p className="mt-3 font-serif text-2xl font-light leading-snug text-bone md:text-3xl">
                  Custom <span className="italic">ETABS 22 API (C#)</span> scripts and parametric calculation templates connecting analytical forces directly to traceable SRPMK, anchor, and steel connection checks—reducing thousands of beam verifications from days to minutes.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 md:col-span-5">
                <div>
                  <div className="font-serif text-3xl text-bone">1000s</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                    Beams / Run
                  </div>
                </div>
                <div>
                  <div className="font-serif text-3xl text-bone">Minutes</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                    Turnaround
                  </div>
                </div>
                <div>
                  <div className="font-serif text-3xl text-bone">100%</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                    Traceable
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials Colophon */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-stone">
              Education, Licensure &amp; Memberships
            </div>

            <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Education */}
              <div className="border-t border-bone/20 pt-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  Education · {credentials.education.period}
                </div>
                <h3 className="mt-3 font-serif text-2xl text-bone">
                  {credentials.education.degree}
                </h3>
                <p className="mt-1 text-sm text-bone/75">
                  {credentials.education.institution}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/90">
                  {credentials.education.honors}
                </p>
                <p className="mt-4 text-xs leading-relaxed text-stone">
                  Thesis: <span className="italic text-bone/75">{credentials.education.thesis}</span>
                </p>
              </div>

              {/* Official BNSP / LPJK SKK */}
              <div className="border-t border-bone/20 pt-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  Licensure · {credentials.certification.validity}
                </div>
                <h3 className="mt-3 font-serif text-2xl text-bone">
                  {credentials.certification.title}
                </h3>
                <p className="mt-1 text-sm text-bone/75">
                  {credentials.certification.subtitle}
                </p>
                <p className="mt-1 text-xs text-stone">
                  {credentials.certification.issuer}
                </p>
                <div className="mt-4 space-y-1 border-t border-bone/10 pt-3 font-mono text-[11px] text-bone/80">
                  <div>
                    <span className="text-stone">Cert. No.</span>{" "}
                    {credentials.certification.certNumber}
                  </div>
                  <div>
                    <span className="text-stone">Reg. No.</span>{" "}
                    {credentials.certification.regNumber}
                  </div>
                </div>
              </div>

              {/* Memberships & Training */}
              <div className="border-t border-bone/20 pt-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  Affiliations &amp; Workshops
                </div>
                <div className="mt-3 space-y-3">
                  {credentials.memberships.map((m) => (
                    <div key={m.abbr}>
                      <span className="font-mono text-xs text-bone">{m.abbr}</span>
                      <span className="mx-2 text-bone/25">—</span>
                      <span className="text-sm text-bone/75">{m.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2 border-t border-bone/10 pt-4">
                  {credentials.training.map((t) => (
                    <div key={t.title} className="text-xs text-stone">
                      <span className="font-mono text-bone/70">{t.year}</span>
                      <span className="mx-2">·</span>
                      <span>{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CONTACT & EDITORIAL FOOTER
         ===================================================================== */}
      <section id="contact" className="border-t border-bone/10 py-28 md:py-36">
        <div className="mx-auto max-w-[1380px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-stone">
                Inquiries &amp; Correspondence
              </div>
              <h2 className="mt-4 font-serif text-4xl font-light leading-[1.1] text-bone md:text-6xl">
                Let’s talk about your next{" "}
                <span className="italic">structure.</span>
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-stone">
                {profile.availability}. Direct inquiries for senior engineering leadership, hyperscale data centers, forensic technical due diligence, and industrial retrofit.
              </p>

              <div className="mt-10 space-y-6 border-t border-bone/10 pt-8">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                    Email
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <a
                      href={`mailto:${profile.email}`}
                      className="font-serif text-2xl text-bone transition hover:opacity-70 sm:text-3xl"
                    >
                      {profile.email}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 border border-bone/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-stone transition hover:border-bone/45 hover:text-bone"
                    >
                      {copiedEmail ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedEmail ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-8 pt-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-bone/80 transition hover:text-bone"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={encodeURI(profile.cvUrl)}
                    download={profile.cvFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-bone/80 transition hover:text-bone"
                  >
                    <span>Resume (PDF — Nov 2026)</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Minimalist Hairline Inquiry Form */}
            <form
              onSubmit={handleInquirySubmit}
              className="flex flex-col gap-7 border-t border-bone/15 pt-8 lg:col-span-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone">
                Quick Correspondence Brief
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  Name / Organisation
                </label>
                <input
                  type="text"
                  required
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Your name and company"
                  className="mt-2 w-full border-b border-bone/20 bg-transparent py-3 text-sm text-bone placeholder:text-stone/50 focus:border-bone focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  Subject
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-2 w-full border-b border-bone/20 bg-obsidian py-3 text-sm text-bone focus:border-bone focus:outline-none"
                >
                  <option value="Senior Structural Role">Senior Structural Role</option>
                  <option value="Data Center Structural Engineering">
                    Data Center Structural Engineering
                  </option>
                  <option value="Forensic Assessment / Retrofit / TDD">
                    Forensic Assessment / Retrofit / TDD
                  </option>
                  <option value="Industrial / Building Consultancy">
                    Industrial / Building Consultancy
                  </option>
                  <option value="General Collaboration">General Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Brief overview of role, project scope, location, or timeline..."
                  className="mt-2 w-full resize-none border-b border-bone/20 bg-transparent py-3 text-sm text-bone placeholder:text-stone/50 focus:border-bone focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 border border-bone bg-bone px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-obsidian transition hover:bg-transparent hover:text-bone"
                >
                  <span>Compose Email</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer className="border-t border-bone/10 py-8">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4 px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-stone md:px-12">
          <span>
            {profile.name} — Based in Jakarta · Working across {profile.region}
          </span>
          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()}</span>
            <a href="#top" className="text-bone/75 transition hover:text-bone">
              Top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* CASE STUDY MODAL */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProjectId(null)}
          onPrev={() => stepProject(-1)}
          onNext={() => stepProject(1)}
          onOpenLightbox={(slides, idx) =>
            setLightboxState({ slides, index: idx })
          }
        />
      )}

      {/* FULLSCREEN LIGHTBOX */}
      {lightboxState && (
        <Lightbox
          slides={lightboxState.slides}
          index={lightboxState.index}
          onClose={() => setLightboxState(null)}
          onChangeIndex={(nextIdx) =>
            setLightboxState((prev) =>
              prev ? { ...prev, index: nextIdx } : null
            )
          }
        />
      )}

      {/* MINIMAL TOAST */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[140] border border-bone/25 bg-obsidian/95 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-bone backdrop-blur-md"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
