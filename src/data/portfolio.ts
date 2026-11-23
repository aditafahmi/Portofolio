export interface GallerySlide {
  src: string;
  caption: string;
  badge: string;
  lightPlate?: boolean;
}

export interface ComparePair {
  left: { src: string; label: string; lightPlate?: boolean };
  right: { src: string; label: string; lightPlate?: boolean };
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  number: string;
  image: string;
  coverLightPlate?: boolean;
  title: string;
  category: string;
  location: string;
  year: string;
  role: string;
  summary: string;
  impact: string;
  challenge: string;
  approach: string;
  result: string;
  specs: ProjectSpec[];
  software: string[];
  codes: string[];
  comparePair?: ComparePair;
  gallery: GallerySlide[];
}

export interface MoreVisualProject {
  title: string;
  location: string;
  category: string;
  note: string;
  image: string;
  badge: string;
  lightPlate?: boolean;
  extraSlides?: GallerySlide[];
}

export const PORTFOLIO = {
  profile: {
    name: "Adita Fahmi Hanif, S.T.",
    shortName: "Adita Fahmi Hanif",
    role: "Lead Structural Engineer",
    disciplines: ["Data Centers", "Seismic Design", "Retrofit & Forensics"],
    location: "Jakarta, Indonesia",
    region: "Southeast & Central Asia",
    availability: "Open to engineering management, senior structural roles, and consulting collaborations",
    tagline:
      "The earth moves. The fire burns. The structure doesn’t flinch.",
    about: [
      "Lead Structural Engineer with 14 years of experience in the design and assessment of industrial facilities, mission-critical data centers and medium-rise buildings, including international projects in Southeast and Central Asia. Specialised in seismic engineering and advanced reinforced concrete design, with strong competence in steel structures. Led the structural design of Indonesia's 20 MW National E-Gov Data Center, the first GBCI Platinum-certified data center in the country, and currently leads structural design for hyperscale data centers of up to ±123 MW.",
      "Extensive experience on structures already in service: forensic investigation, post-fire and post-earthquake assessment, technical due diligence and retrofit of facilities in operation. Earlier career work covers combined-cycle power plants, LNG and mining facilities. Designs are kept fully traceable from report to model to source data, supported by in-house ETABS API scripts and parametric design templates for special moment frame beams and columns, anchors and steel connections.",
    ],
    email: "aditafahmihanif@gmail.com",
    cvUrl: "Resume Adita Fahmi Hanif - Nov 2026.pdf",
    cvFileName: "Resume Adita Fahmi Hanif - Nov 2026.pdf",
    linkedin: "https://www.linkedin.com/in/adita-hanif-600108b9",
    media: {
      heroEditorial: "editorial-hero-16x9-v2.jpg",
      fieldPortrait: "site-documentary-3x2.jpg",
      executivePortrait: "executive-rooftop-4x5.jpg",
    },
  },

  /**
   * Curated full-bleed photographic & architectural plates for the 3D WebGL
   * Infinite Gallery Hero (zero harsh white-background boxes in 3D space).
   */
  heroGalleryImages: [
    {
      src: "editorial-portrait-4x5-v2.jpg",
      alt: "Adita Fahmi Hanif — Editorial Portrait",
    },
    {
      src: "assets/neutradc-00-campus-aerial-render.jpg",
      alt: "Hyperscale Data Center Campus (±123 MW), West Java",
      projectId: "proj-3",
    },
    {
      src: "site-documentary-3x2.jpg",
      alt: "Field Inspection — Reinforced Concrete Construction",
    },
    {
      src: "assets/mane-00-tower-perspective-render.jpg",
      alt: "14-Storey Office Tower & Creation Lab, Jakarta",
      projectId: "proj-6",
    },
    {
      src: "assets/postfire-01-existing-vs-expansion.png",
      alt: "Post-Fire Assessment — Seven-Storey Process Plant",
      projectId: "proj-4",
    },
    {
      src: "executive-rooftop-4x5.jpg",
      alt: "Jakarta Skyline — Structural Engineering Leadership",
    },
    {
      src: "assets/ctrls-00-bim-3d-campus.jpg",
      alt: "Hyperscale Data Center DC01 (78 MW), Thailand",
      projectId: "proj-2",
    },
    {
      src: "assets/nico-00-plant-aerial-render.jpg",
      alt: "Greenfield Coconut Processing Plant, Tobelo",
      projectId: "proj-7",
    },
    {
      src: "assets/egov-02-render-front.jpg",
      alt: "National E-Gov Data Center (20 MW), Cikarang",
      projectId: "proj-1",
    },
    {
      src: "assets/mane-03-aerial-render.jpg",
      alt: "14-Storey Office Tower Aerial View, Jakarta",
      projectId: "proj-6",
    },
  ],

  highlights: [
    { value: "14+", label: "Years in Structural Engineering" },
    { value: "30+", label: "Projects Across 4 Countries" },
    { value: "200+ MW", label: "Data Center Capacity Engineered" },
    { value: "Tier IV", label: "Indonesia's First GBCI Platinum DC" },
  ],

  projects: [
    {
      id: "proj-1",
      number: "01",
      image: "assets/egov-02-render-front.jpg",
      coverLightPlate: false,
      title: "National E-Gov Data Center (20 MW)",
      category: "Data Center",
      location: "Cikarang, Indonesia",
      year: "2022–2024",
      role: "Structural Lead Engineer",
      summary:
        "Indonesia's National Data Center for the Ministry of Communication & Informatics: 18,000 m² over 4 storeys, Uptime Tier IV and TIA-942.",
      impact:
        "Part of the team that delivered Indonesia's first GBCI Platinum-certified data center.",
      challenge:
        "A mission-critical facility carrying heavy electrical and mechanical equipment, where structural performance under earthquake directly affects uptime.",
      approach:
        "Led the structural design through RIBA stages 3 and 4, covering seismic analysis, heavy equipment support and the integration of reinforced concrete and steel systems for both the data center and its admin building.",
      result:
        "A design that met Tier IV / TIA-942 requirements and supported the project's GBCI Platinum certification.",
      specs: [
        { label: "GFA & Scale", value: "18,000 m² · 4 Storeys" },
        { label: "IT Capacity", value: "20 MW Mission-Critical" },
        { label: "Certification", value: "Uptime Tier IV · GBCI Platinum" },
        { label: "System", value: "RC & Integrated Steel" },
      ],
      software: ["ETABS", "SAFE"],
      codes: ["SNI 1726", "SNI 2847", "SNI 1729", "ASCE 7", "ACI 318", "TIA-942"],
      comparePair: {
        left: {
          src: "assets/egov-02-render-front.jpg",
          label: "Concept Render — Front Elevation (Design Team)",
          lightPlate: false,
        },
        right: {
          src: "assets/egov-01-etabs-3d-model.png",
          label: "ETABS 3D Structural Model",
          lightPlate: true,
        },
      },
      gallery: [
        {
          src: "assets/egov-01-etabs-3d-model.png",
          caption: "ETABS 3D structural model with material assignments",
          badge: "ETABS 3D Model",
          lightPlate: true,
        },
        {
          src: "assets/egov-04-seismic-deformed-shape.png",
          caption: "Seismic deformed shape verification (ASCE 7-16)",
          badge: "Seismic Analysis",
          lightPlate: true,
        },
        {
          src: "assets/egov-02-render-front.jpg",
          caption: "Front elevation concept render (Design Team)",
          badge: "Concept Render",
          lightPlate: false,
        },
        {
          src: "assets/egov-03-render-entrance.jpg",
          caption: "Site entrance & approach concept render (Design Team)",
          badge: "Concept Render",
          lightPlate: false,
        },
      ],
    },
    {
      id: "proj-2",
      number: "02",
      image: "assets/ctrls-00-bim-3d-campus.jpg",
      coverLightPlate: false,
      title: "Hyperscale Data Center DC01 (78 MW)",
      category: "Data Center",
      location: "Eastern Thailand",
      year: "2026",
      role: "Lead Structural Engineer (with ACT Thailand, Engineer of Record)",
      summary:
        "A 78 MW, TIA-942 Rated-4 data center in eastern Thailand: three data hall levels, generator floors, plant terraces and a chiller platform about 31 m above ground.",
      impact:
        "Structural concept model and building-permit calculation report delivered under Thai DPT/EIT codes.",
      challenge:
        "Very high floor capacity (2.5 t/m² on every level), column-free bays up to 13.4 m, and heavy generators, transformers and chillers stacked over several levels under Thai DPT/EIT regulations new to the team.",
      approach:
        "Built and iterated the ETABS model of DC01, set the design brief mapping Thai DPT/EIT requirements against ACI/ASCE, mapped the client's equipment load plan against the model, and produced the permit calculation report alongside the Thai engineer of record.",
      result:
        "Concept and permit design issued and revised through client and authority review rounds.",
      specs: [
        { label: "IT Capacity", value: "78 MW · TIA-942 Rated-4" },
        { label: "Floor Load", value: "2.5 t/m² Every Level" },
        { label: "Clear Span", value: "Column-Free Bays up to 13.4 m" },
        { label: "Chiller Level", value: "Steel Platform ~31 m AGL" },
      ],
      software: ["ETABS", "Parametric Excel"],
      codes: ["Thai DPT 1301/1302", "Thai DPT 1311", "EIT", "ACI 318", "ASCE 7"],
      comparePair: {
        left: {
          src: "assets/ctrls-00-bim-3d-campus.jpg",
          label: "BIM 3D Campus Massing",
          lightPlate: false,
        },
        right: {
          src: "assets/ctrls-01-etabs-3d-model.png",
          label: "ETABS 3D Structural Frame",
          lightPlate: true,
        },
      },
      gallery: [
        {
          src: "assets/ctrls-00-bim-3d-campus.jpg",
          caption: "BIM 3D campus massing overview",
          badge: "BIM 3D Massing",
          lightPlate: false,
        },
        {
          src: "assets/ctrls-01-etabs-3d-model.png",
          caption: "ETABS 3D structural frame model — DC01",
          badge: "ETABS 3D Model",
          lightPlate: true,
        },
        {
          src: "assets/ctrls-02-etabs-3d-equipment-loads.png",
          caption: "Stacked generator, transformer & chiller load mapping in ETABS",
          badge: "Equipment Loads",
          lightPlate: true,
        },
        {
          src: "assets/ctrls-03-response-spectrum.png",
          caption: "Design response spectrum — Site Class C (Thai DPT 1301/1302)",
          badge: "Response Spectrum",
          lightPlate: true,
        },
        {
          src: "assets/ctrls-05-bim-3d-campus-shaded.jpg",
          caption: "Shaded BIM 3D campus perspective",
          badge: "BIM Perspective",
          lightPlate: false,
        },
      ],
    },
    {
      id: "proj-3",
      number: "03",
      image: "assets/neutradc-00-campus-aerial-render.jpg",
      coverLightPlate: false,
      title: "Hyperscale Data Center Campus (±123 MW)",
      category: "Data Center",
      location: "West Java, Indonesia",
      year: "2026",
      role: "Lead Structural Engineer · Design Brief Author",
      summary:
        "Concept design for a hyperscale data center campus in West Java: AI-ready data halls, four-storey generator buildings and underground water tanks.",
      impact:
        "Defined the structural basis for the full campus, with ETABS API automation cutting beam design checks from file-per-beam to minutes for thousands of beams.",
      challenge:
        "Data hall floors of 15–25 kN/m², transformer transport routes through the building and AI-ready equipment loads in a high-seismic setting under Risk Category III.",
      approach:
        "Authored the Civil & Structural Design Brief, built the ETABS models for the buildings and tanks, and wrote ETABS API (C#) scripts that extract forces and populate beam design templates automatically.",
      result:
        "A consistent concept design across campus phases and a beam-design verification pipeline running across thousands of beams in minutes.",
      specs: [
        { label: "Campus Scale", value: "±123 MW Hyperscale" },
        { label: "Floor Load", value: "15–25 kN/m² (AI-Ready)" },
        { label: "Seismic Class", value: "Risk Category III" },
        { label: "Automation", value: "ETABS 22 API (C#)" },
      ],
      software: ["ETABS 22", "ETABS API (C#)", "Parametric Excel"],
      codes: ["SNI 1726", "SNI 1727", "SNI 2847", "ASCE 7-16", "ACI 318-19", "ACI 350.3"],
      comparePair: {
        left: {
          src: "assets/neutradc-00-campus-aerial-render.jpg",
          label: "Campus Aerial Concept Render (Architecture Team)",
          lightPlate: false,
        },
        right: {
          src: "assets/neutradc-01-etabs-3d-model.png",
          label: "ETABS 3D Data Hall Model",
          lightPlate: true,
        },
      },
      gallery: [
        {
          src: "assets/neutradc-00-campus-aerial-render.jpg",
          caption: "Hyperscale campus aerial concept render (Architecture Team)",
          badge: "Concept Render",
          lightPlate: false,
        },
        {
          src: "assets/neutradc-01-etabs-3d-model.png",
          caption: "ETABS 3D structural model — main data hall block",
          badge: "ETABS 3D Model",
          lightPlate: true,
        },
        {
          src: "assets/neutradc-02-etabs-3d-generator-building.png",
          caption: "ETABS 3D model — four-storey RC generator building",
          badge: "Generator Bldg",
          lightPlate: true,
        },
        {
          src: "assets/neutradc-03-data-hall-load-zoning.png",
          caption: "Data hall live-load and transformer transport zoning",
          badge: "Load Zoning",
          lightPlate: true,
        },
        {
          src: "assets/neutradc-04-beam-detail.png",
          caption: "Automated SRPMK reinforced concrete beam section output",
          badge: "Beam Detail",
          lightPlate: true,
        },
        {
          src: "assets/neutradc-09-bim-massing.png",
          caption: "Campus structural BIM massing study",
          badge: "BIM Massing",
          lightPlate: true,
        },
      ],
    },
    {
      id: "proj-4",
      number: "04",
      image: "assets/postfire-01-existing-vs-expansion.png",
      coverLightPlate: false,
      title: "Post-Fire Assessment — Seven-Storey Process Plant",
      category: "Retrofit & Forensic",
      location: "East Java, Indonesia",
      year: "2026",
      role: "Lead Author · Technical Due Diligence",
      summary:
        "Forensic and capacity assessment of a seven-storey steel braced-frame plant after a fire damaged Levels 5 to 7.",
      impact:
        "Gave the owner a clear engineering basis for rebuilding the plant with additional floors and relocated equipment.",
      challenge:
        "A plant built in 1995, expanded in 2004 and modified repeatedly since, with incomplete records and fire damage across the upper levels.",
      approach:
        "Inspected damaged members and connections on site, reconstructed the existing steel braced frame in an analytical model, and simulated the proposed additional floors and relocated equipment to locate structural shortfalls.",
      result:
        "Issued a Technical Due Diligence report detailing condition findings, strengthening requirements and integration risks for redevelopment.",
      specs: [
        { label: "Structure", value: "7-Storey Steel Braced Frame" },
        { label: "History & GFA", value: "Built 1995 / Exp. 2004 · 1,995 m²" },
        { label: "Fire Zone", value: "Levels 5 to 7" },
        { label: "Deliverable", value: "Forensic & Expansion TDD" },
      ],
      software: ["ETABS"],
      codes: ["SNI 1729", "AISC 360"],
      gallery: [
        {
          src: "assets/postfire-01-existing-vs-expansion.png",
          caption: "Existing seven-storey plant compared with proposed expansion",
          badge: "Expansion Study",
          lightPlate: false,
        },
        {
          src: "assets/postfire-02-etabs-3d-existing-frame.png",
          caption: "Reconstructed ETABS 3D analytical model of existing braced frame",
          badge: "ETABS 3D Model",
          lightPlate: true,
        },
        {
          src: "assets/postfire-03-stress-ratio-check.png",
          caption: "Member demand-to-capacity stress ratio evaluation",
          badge: "Stress Ratio",
          lightPlate: true,
        },
      ],
    },
    {
      id: "proj-5",
      number: "05",
      image: "assets/lesaffre-01-etabs-3d-existing-plus-new.png",
      coverLightPlate: true,
      title: "Yeast Production Building Extension",
      category: "Industrial",
      location: "East Java, Indonesia",
      year: "2024–2026",
      role: "Lead Structural Engineer · Calculation Report Author",
      summary:
        "Extension of a five-storey instant dry yeast production building (GFA 5,711 m²) inside a factory in full operation.",
      impact:
        "Carried from basic design through detailed design, design change notices and the PBG building permit.",
      challenge:
        "New reinforced concrete frames had to tie into an existing building carrying heavy process equipment (dryer, rotary filter, tanks), with limited as-built data inside an operating plant.",
      approach:
        "Modelled the existing and new structure together in ETABS, evaluated the combined building for seismic demand, and detailed targeted retrofit measures where member demands increased.",
      result:
        "Complete detailed design and calculation package issued, managing design changes smoothly through to PBG permit approval.",
      specs: [
        { label: "Scale", value: "5 Storeys + Roof · 5,711 m² GFA" },
        { label: "System", value: "RC Frames Tied to Existing Plant" },
        { label: "Equipment", value: "Dryer, Rotary Filter & Tanks" },
        { label: "Scope", value: "Basic → Detailed → DCN → PBG" },
      ],
      software: ["ETABS", "SAFE"],
      codes: ["SNI 1726", "SNI 2847", "SNI 1729"],
      gallery: [
        {
          src: "assets/lesaffre-01-etabs-3d-existing-plus-new.png",
          caption: "Combined ETABS model integrating existing factory and new 5-storey extension",
          badge: "Combined Model",
          lightPlate: true,
        },
        {
          src: "assets/lesaffre-02-etabs-3d-model.png",
          caption: "ETABS 3D structural frame analysis view",
          badge: "ETABS 3D Model",
          lightPlate: true,
        },
        {
          src: "assets/lesaffre-03-steel-frame-3d.png",
          caption: "3D steel framing & equipment support elevation",
          badge: "Steel Framing",
          lightPlate: true,
        },
      ],
    },
    {
      id: "proj-6",
      number: "06",
      image: "assets/mane-00-tower-perspective-render.jpg",
      coverLightPlate: false,
      title: "14-Storey Office Tower & Creation Lab",
      category: "Commercial",
      location: "Jakarta, Indonesia",
      year: "2023–2025",
      role: "Lead Structural Engineer",
      summary:
        "A 14-storey office tower with a three-level basement in Jakarta, engineered through to the PBG building permit.",
      impact:
        "Complete seismic structural package prepared for the Jakarta PBG submission.",
      challenge:
        "A medium-rise tower in a seismic zone over a deep three-level basement, with an underground water tank introduced late via a design change.",
      approach:
        "Led the seismic analysis and lateral-system design, engineered the basement retaining walls and tank, and kept analytical models, calculations and drawings aligned across every design change cycle.",
      result:
        "Issued a unified, permit-ready structural package for the Jakarta PBG submission.",
      specs: [
        { label: "Scale", value: "14 Storeys + 3-Level Basement" },
        { label: "System", value: "RC Lateral Core & Frame" },
        { label: "Late Scope", value: "Underground Tank Integration" },
        { label: "Permit", value: "Jakarta PBG Package" },
      ],
      software: ["ETABS"],
      codes: ["SNI 1726", "SNI 2847", "ACI 350.3"],
      comparePair: {
        left: {
          src: "assets/mane-00-tower-perspective-render.jpg",
          label: "Tower Perspective — Concept Render (Archetype)",
          lightPlate: false,
        },
        right: {
          src: "assets/mane-01-etabs-3d-tower.png",
          label: "ETABS 3D Tower & Shear Wall Core",
          lightPlate: true,
        },
      },
      gallery: [
        {
          src: "assets/mane-00-tower-perspective-render.jpg",
          caption: "Tower perspective — concept render (Archetype Architecture Team)",
          badge: "Concept Render",
          lightPlate: false,
        },
        {
          src: "assets/mane-01-etabs-3d-tower.png",
          caption: "ETABS 3D structural model — 14-storey tower & core",
          badge: "ETABS 3D Model",
          lightPlate: true,
        },
        {
          src: "assets/mane-02-etabs-3d-transparent.png",
          caption: "ETABS transparent model showing lateral core & 3-level basement",
          badge: "Core & Basement",
          lightPlate: true,
        },
        {
          src: "assets/mane-03-aerial-render.jpg",
          caption: "Urban context aerial view — concept render (Archetype)",
          badge: "Concept Render",
          lightPlate: false,
        },
        {
          src: "assets/mane-06-street-entrance-render.jpg",
          caption: "Street entrance — concept render (Archetype)",
          badge: "Concept Render",
          lightPlate: false,
        },
      ],
    },
    {
      id: "proj-7",
      number: "07",
      image: "assets/nico-00-plant-aerial-render.jpg",
      coverLightPlate: false,
      title: "Greenfield Coconut Processing Plant",
      category: "Industrial",
      location: "Tobelo, North Maluku",
      year: "2025–2026",
      role: "Lead Structural Engineer",
      summary:
        "Concept design for a 92-hectare greenfield coconut processing campus: production halls, warehouses, process & tank zones, offices and worker dormitories.",
      impact:
        "Consistent structural concept and quantity estimates across every building on the 92-ha campus.",
      challenge:
        "A remote greenfield site with dozens of buildings spanning long-span industrial halls to light support buildings, requiring early definition for project budgeting.",
      approach:
        "Established optimal structural systems per building typology—steel portal frames and long-span roof trusses for production and storage, light framing for offices and dormitories—complete with framing layouts and material quantities.",
      result:
        "Delivered a unified campus-wide structural concept across staged client design reviews.",
      specs: [
        { label: "Masterplan", value: "92-Hectare Greenfield Campus" },
        { label: "Primary Halls", value: "Steel Portal Frames & Trusses" },
        { label: "Support Bldgs", value: "Light Framing & Dormitories" },
        { label: "Deliverable", value: "Campus Concept & Quantities" },
      ],
      software: ["ETABS", "AutoCAD", "Parametric Excel"],
      codes: ["SNI 1726", "SNI 1727", "SNI 1729", "AISC 360"],
      comparePair: {
        left: {
          src: "assets/nico-00-plant-aerial-render.jpg",
          label: "Plant Aerial Concept Render",
          lightPlate: false,
        },
        right: {
          src: "assets/nico-05-frame-and-roof-truss-3d.png",
          label: "3D Steel Frame & Long-Span Roof Truss",
          lightPlate: true,
        },
      },
      gallery: [
        {
          src: "assets/nico-00-plant-aerial-render.jpg",
          caption: "Greenfield coconut processing plant — aerial concept render",
          badge: "Concept Render",
          lightPlate: false,
        },
        {
          src: "assets/nico-05-frame-and-roof-truss-3d.png",
          caption: "3D steel portal frame & roof truss framing study (36 m × 24 m)",
          badge: "3D Steel Frame",
          lightPlate: true,
        },
        {
          src: "assets/nico-06-roof-truss-section.png",
          caption: "Structural steel roof truss cross-section",
          badge: "Truss Section",
          lightPlate: true,
        },
        {
          src: "assets/nico-02-masterplan-aerial.jpg",
          caption: "92-ha industrial campus masterplan — concept render",
          badge: "Masterplan",
          lightPlate: false,
        },
        {
          src: "assets/nico-03-warehouse-render.jpg",
          caption: "Long-span storage warehouse — concept render",
          badge: "Warehouse",
          lightPlate: false,
        },
        {
          src: "assets/nico-04-tank-and-process-area-render.jpg",
          caption: "Tank farm and process zone — concept render",
          badge: "Process Area",
          lightPlate: false,
        },
      ],
    },
    {
      id: "proj-8",
      number: "08",
      image: "assets/prev-energy-01-jawa2-ccpp-warehouse-3d.jpg",
      coverLightPlate: true,
      title: "Power Plant, LNG & Mining Facilities",
      category: "Energy & Resources",
      location: "Jakarta · Papua · Sumatra · Kalimantan",
      year: "2013–2018",
      role: "Lead Engineer (CCPP) · Structural Engineer",
      summary:
        "Structural design for two combined-cycle power plant extensions in Jakarta, plus engineering support for LNG and mining facilities across Indonesia.",
      impact:
        "Led power block support structures and created the in-house SRPMK, anchor and steel connection design templates still used by the firm today.",
      challenge:
        "Support structures for heavy power-generation equipment and piping with tight contractor interfaces and international design standards.",
      approach:
        "Led design of concentrically braced steel moment frames, pipe racks, sheds, warehouses and equipment foundations for two CCPP extensions, alongside structural support for LNG in eastern Indonesia, Papua mining, South Sumatra coal facilities and an East Kalimantan port expansion study.",
      result:
        "Delivered plant calculation packages and built enduring parametric SRPMK, anchor bolt and steel connection spreadsheets.",
      specs: [
        { label: "Power Plants", value: "2 Combined-Cycle Extensions" },
        { label: "Structures", value: "Braced Steel, Pipe Racks, Foundations" },
        { label: "Resources", value: "LNG, Mining & Coal Port Studies" },
        { label: "Legacy", value: "In-House Parametric Templates" },
      ],
      software: ["STAAD.Pro", "SAP2000", "ETABS", "Parametric Excel"],
      codes: ["AISC 360 / 341", "ACI 318", "ASCE 7", "SNI 1726 / 2847"],
      gallery: [
        {
          src: "assets/prev-energy-01-jawa2-ccpp-warehouse-3d.jpg",
          caption: "STAAD.Pro 3D steel frame model — CCPP support warehouse",
          badge: "STAAD.Pro Model",
          lightPlate: true,
        },
        {
          src: "assets/prev-energy-02-jawa2-ccpp-pipe-rack.jpg",
          caption: "STAAD.Pro 3D analytical model — industrial pipe rack",
          badge: "Pipe Rack Model",
          lightPlate: true,
        },
      ],
    },
  ] as Project[],

  moreProjectsVisual: [
    {
      title: "Process Filter Building",
      location: "Industrial Facility",
      category: "Seismic RC Frame",
      note: "Reinforced concrete special moment frame designed to Seismic Design Category D.",
      image: "assets/cabot-01-etabs-3d-model.jpg",
      badge: "ETABS Model",
      lightPlate: true,
    },
    {
      title: "Resort Terrace Roof Extension",
      location: "Bintan, Indonesia",
      category: "Hospitality",
      note: "3D structural study model for a coastal resort terrace restaurant roof extension.",
      image: "assets/clubmed-01-roof-extension-3d-front.jpg",
      badge: "3D Study Model",
      lightPlate: false,
      extraSlides: [
        {
          src: "assets/clubmed-02-roof-extension-3d-side.jpg",
          badge: "3D Side Elevation",
          caption: "Resort Terrace Roof Extension (Bintan) — side perspective",
          lightPlate: false,
        },
      ],
    },
    {
      title: "Steel Stair Strengthening",
      location: "Jakarta CBD Office",
      category: "Retrofit & FEA",
      note: "Finite element structural verification and strengthening for an office feature stair.",
      image: "assets/scbd-01-stair-fe-model.jpg",
      badge: "FE Model",
      lightPlate: true,
    },
    {
      title: "High-Seismic Admixture Plant",
      location: "Almaty, Kazakhstan",
      category: "International Industrial",
      note: "Structural engineering for an industrial admixture plant in a high-seismic Central Asian zone (client concept reference).",
      image: "assets/sika-02-tank-farm-3d-brief.jpg",
      badge: "Client Concept",
      lightPlate: true,
      extraSlides: [
        {
          src: "assets/sika-01-process-tower-3d-reference.jpg",
          badge: "Client Concept",
          caption: "High-Seismic Admixture Plant (Almaty) — process tower client specification reference",
          lightPlate: true,
        },
      ],
    },
    {
      title: "Post-Earthquake Damage Survey",
      location: "Lombok, Indonesia",
      category: "Forensic Assessment",
      note: "Post-earthquake structural inspection, damage mapping and repair/retrofit recommendations.",
      image: "assets/prev-hotel-01-lombok-post-earthquake-survey.jpg",
      badge: "Site Survey",
      lightPlate: false,
      extraSlides: [
        {
          src: "assets/prev-hotel-02-column-damage-detail.jpg",
          badge: "Damage Detail",
          caption: "Post-Earthquake Damage Survey (Lombok) — reinforced concrete column damage documentation",
          lightPlate: false,
        },
      ],
    },
  ] as MoreVisualProject[],

  moreProjectsRegister: [
    { title: "Food Processing Plant (±25,000 m²)", location: "West Java", scope: "Industrial Design" },
    { title: "Crane Workshop Facility", location: "East Kalimantan", scope: "Heavy Industrial Steel" },
    { title: "Factory Forensic Investigation & Retrofit", location: "Medan", scope: "Forensic & Strengthening" },
    { title: "Post-Earthquake Structural Assessments", location: "Lombok · Palu · Bali", scope: "Seismic Damage Audit" },
    { title: "Resort Technical Due Diligence", location: "Bali", scope: "Condition Survey & TDD" },
    { title: "18-Storey 3-Tower Apartment Complex", location: "Bandung", scope: "High-Rise RC Design" },
    { title: "Embassy Building", location: "Jakarta", scope: "Institutional Structure" },
    { title: "Regional Parliament Building", location: "West Java", scope: "Civic Architecture" },
  ],

  experiences: [
    {
      period: "2022 — Present",
      title: "Lead Structural Engineer (Civil & Structural Engineering Team Leader)",
      organization: "Archetype, Indonesia",
      description:
        "Leads structural design for data centers, industrial plants and commercial buildings in Indonesia and abroad, and leads retrofit, forensic and technical due diligence assessments. Reviews the team's calculations and drives in-house design automation.",
    },
    {
      period: "2022",
      title: "Civil Engineering Expert",
      organization: "Asia Pulp & Paper, Indonesia",
      description: "Civil and structural engineering support for pulp and paper plant facilities.",
    },
    {
      period: "2018 — 2022",
      title: "Structural Engineer",
      organization: "Royal Haskoning Indonesia",
      description:
        "Design and assessment of industrial facilities and buildings in the Industry & Buildings group, including post-earthquake damage assessments with repair and retrofit recommendations.",
    },
    {
      period: "2013 — 2018",
      title: "Structural Engineer → Lead Structural Engineer",
      organization: "PT BITA Enarcon, Indonesia",
      description:
        "Lead engineer for combined-cycle power plant structures; structural engineer on LNG and mining projects. Developed the in-house SRPMK beam and column, anchor bolt and steel connection design templates still in use by the firm's design team.",
    },
    {
      period: "2012 — 2013",
      title: "Civil Structural Engineer",
      organization: "Nusantara Cipta, Indonesia",
      description: "Structural design of building projects at the start of the career.",
    },
  ],

  skills: [
    {
      group: "Seismic & Structural Design",
      items: [
        "Seismic Analysis (Response Spectrum, Drift, P-Δ)",
        "Advanced Reinforced Concrete Design",
        "Steel Structures & Long-Span Trusses",
        "Heavy Equipment & Data Hall Floors",
        "Retrofit & Structural Strengthening",
        "Forensic Investigation & Technical Due Diligence",
      ],
    },
    {
      group: "Software & Automation",
      items: [
        "ETABS & SAFE",
        "SAP2000 & STAAD.Pro",
        "Robot Structural Analysis & spColumn",
        "AutoCAD & Autodesk Revit (Model Review)",
        "ETABS API Automation (C# via PowerShell)",
        "Parametric SRPMK, Anchor & Steel Connection Templates",
        "AI-Assisted Engineering Workflows",
      ],
    },
    {
      group: "Codes & Standards",
      items: [
        "SNI 1726 · 1727 · 2847 · 1729",
        "ASCE 7-16",
        "ACI 318-19 & ACI 350.3",
        "AISC 360 & AISC 341",
        "British Standards (BS)",
        "Eurocode (SP RK EN)",
        "Thai DPT 1301/1302 · DPT 1311 · EIT",
      ],
    },
  ],

  credentials: {
    education: {
      degree: "B.Eng. in Civil Engineering (S.T.)",
      institution: "Institut Teknologi Nasional (ITENAS), Bandung",
      period: "2008 — 2012",
      honors: "Cum Laude · GPA 3.51 / 4.00",
      thesis: "Design of Orthotropic Steel Deck Panel with Open 'T' Ribs",
    },
    certification: {
      title: "Ahli Muda Teknik Bangunan Gedung (SKK Level 7)",
      subtitle: "Young Building Engineering Expert · Civil / Building",
      issuer: "BNSP & LPJK · LSP Astekindo Konstruksi Mandiri",
      certNumber: "74321 2142.02 7 00042614 2023",
      regNumber: "F 1993 42614 2023 0102797 SI 01",
      validity: "April 2023 — April 2028",
    },
    memberships: [
      { abbr: "HAKI", name: "Indonesian Society of Civil & Structural Engineers" },
      { abbr: "ACI", name: "American Concrete Institute" },
    ],
    training: [
      { year: "2014", title: "HAKI — Indonesia Siaga Gempa Seismic Workshop" },
      { year: "2012", title: "MIDAS Bridge Engineering Workshop" },
      { year: "2011", title: "SAP2000 Structural Analysis & Design Training" },
    ],
  },
};
