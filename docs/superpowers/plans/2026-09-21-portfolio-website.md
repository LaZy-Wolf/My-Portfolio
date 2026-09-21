# Living Canvas Portfolio — Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, highly customizable, MongoDB-backed portfolio website with an admin control panel, drag-and-drop project sorting, block-based case studies, digital twin AI assistant, and an industrial-brutalist telemetry design system — powered strictly by 100% free-tier resources.

**Architecture:** Single Next.js (App Router, TypeScript) full-stack web application. Server Components for SEO and initial data hydration, Client Components isolated to interactive islands (motion, drag-and-drop, command palette, chat orb). Database tier runs on MongoDB Atlas M0 via Mongoose connection pooling. Image uploads process securely through Cloudinary free tier. Authentication via NextAuth.js credentials provider. AI assistant runs via Groq API (Llama 3.3) with Google Gemini Flash fallback.

**Tech Stack:**
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS + CSS Custom Properties Design Tokens
- **Design Archetype:** Industrial Brutalist UI / Swiss Tactical Telemetry (`display: grid; gap: 1px`, monospace telemetry, aviation red `#E61919` / neon amber highlights, structural dividers, technical framing `[ STATUS: 200 OK ]`)
- **Animation & Scrolling:** `motion` (`motion/react`) + `lenis` (smooth scroll)
- **Database & ODM:** MongoDB Atlas Free Tier (M0) + Mongoose
- **Image Storage:** Cloudinary Free Tier (direct serverless upload endpoint)
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Auth:** NextAuth.js v4/v5 (Credentials Provider, single admin credentials via env)
- **AI Engine:** Groq SDK (`groq-sdk`) with Gemini API (`@google/genai`) fallback
- **Hosting Target:** Vercel Free Tier + GitHub

**Spec:** `C:\Users\gugul\Downloads\PortfolioNow\PortfolioPlan.txt`

## Global Constraints

- **Zero-Dollar Budget:** All services (MongoDB Atlas, Cloudinary, Vercel, Groq/Gemini, GitHub) must operate exclusively on zero-cost free tiers.
- **No Hardcoded Content:** Every public string (Hero text, bio, availability, projects, skills, social links, footer) must originate from MongoDB and be editable from the `/admin` panel.
- **No Binary Blobs in MongoDB:** All media must be uploaded to Cloudinary, storing only secure CDN URLs in MongoDB.
- **Reliable Fallbacks:** If the AI provider key is absent or rate-limited, the AI widget must degrade gracefully with a clear message and never break the page.
- **Strict Viewport Stability:** Never use `h-screen`; use `min-h-[100dvh]` to eliminate mobile address-bar layout shift.
- **Reduced Motion Compliance:** All motion hooks and CSS transitions must strictly honor `prefers-reduced-motion: reduce`.

## Review Focus

1. **MongoDB Atlas Cold Starts / Connection Exhaustion:** Serverless environments can spawn multiple connections; must implement a cached Mongoose singleton to prevent connection leaks.
2. **Missing Environment Keys on Cold Clone:** Application must boot smoothly even if Cloudinary or AI keys are empty initially, displaying helpful admin setup notices rather than unhandled crashes.
3. **Optimistic Drag-and-Drop Desynchronization:** If network fails during project reorder, UI must rollback gracefully to previous order and notify user via toast.
4. **AI Assistant Prompt Injection & Leakage:** System prompt must strictly bound context to portfolio data, prohibiting disclosure of environment variables, admin endpoints, or internal connection strings.
5. **Mobile Viewport Drag-and-Drop Usability:** Provide accessible numeric up/down fallback buttons alongside touch drag handles.

---

## Task 1: Project Initialization & Industrial-Brutalist Design Tokens

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/styles/globals.css`
- Create: `src/lib/utils.ts`

**Interfaces:**
- Produces: CSS custom properties (`--bg-substrate`, `--fg-primary`, `--accent-signal`, `--border-grid`), `cn()` helper utility, Root layout with telemetry HUD frame.

- [ ] **Step 1: Initialize Next.js project with Tailwind CSS & TypeScript**
  Configure `package.json` with dependencies:
  `next`, `react`, `react-dom`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`, `motion`, `lenis`, `lucide-react`, `@phosphor-icons/react`.

- [ ] **Step 2: Configure Industrial-Brutalist CSS tokens in `src/styles/globals.css`**
  Implement Swiss Industrial / Tactical Telemetry substrate tokens:
  ```css
  :root {
    --bg-substrate: #0a0a0a;
    --bg-surface: #121212;
    --bg-elevated: #1a1a1a;
    --fg-primary: #eaeaea;
    --fg-muted: #888888;
    --border-grid: #262626;
    --accent-signal: #e61919;
    --accent-terminal: #4af626;
    --font-mono: 'JetBrains Mono', 'Space Mono', monospace;
    --font-display: 'Inter', system-ui, sans-serif;
  }
  ```
  Include scanline overlay, technical corner brackets, and 1px gap grid utilities.

- [ ] **Step 3: Create utility helper in `src/lib/utils.ts`**
  ```typescript
  import { clsx, type ClassValue } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

- [ ] **Step 4: Create Root Layout with Smooth Scroll (Lenis) & Telemetry Grid Frame**
  Configure `src/app/layout.tsx` with metadata, font imports, viewport setup (`min-h-[100dvh]`), and Lenis smooth scrolling provider.

- [ ] **Step 5: Verify build & dev server**
  Run: `npm run build` or `npm run dev` to verify clean compilation with zero lint/type errors.

---

## Task 2: Database Connection Layer & Mongoose Schemas

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/models/Profile.ts`
- Create: `src/models/Project.ts`
- Create: `src/models/Skill.ts`
- Create: `src/models/Settings.ts`
- Create: `src/scripts/seed.ts`

**Interfaces:**
- Produces: `connectDB(): Promise<typeof mongoose>`, Mongoose models `Profile`, `Project`, `Skill`, `Settings`.
- Consumes: `process.env.MONGODB_URI`.

- [ ] **Step 1: Implement cached database connection singleton in `src/lib/db.ts`**
  Prevent serverless connection storms by caching `mongoose.connection` in `globalThis.mongoose`.

- [ ] **Step 2: Define `Profile` Schema (`src/models/Profile.ts`)**
  Fields: `_id` ('main'), `name`, `role`, `tagline`, `shortBio`, `longBio`, `designPhilosophy`, `avatarUrl`, `resumeUrl`, `email`, `location`, `availability`, `socials` (`github`, `linkedin`, `twitter`, `dribbble`, `behance`), `updatedAt`.

- [ ] **Step 3: Define `Project` Schema (`src/models/Project.ts`)**
  Fields: `title`, `slug` (unique, indexed), `summary`, `role`, `year`, `timeline`, `status` (`draft` | `published`), `featured` (boolean), `order` (number, indexed), `thumbnailUrl`, `galleryUrls` (string[]), `techStack` (string[]), `tags` (string[]), `links` (`live`, `repository`), `metrics` ([{ `label`, `value` }]), `processSteps` (string[]), `caseStudyBlocks` ([{ `type`: string, `content`?: string, `imageUrl`?: string, `caption`?: string, `quote`?: string, `author`?: string }]), `createdAt`, `updatedAt`.

- [ ] **Step 4: Define `Skill` & `Settings` Schemas (`src/models/Skill.ts`, `src/models/Settings.ts`)**
  - `Skill`: `category`, `items` (string[]), `order` (number).
  - `Settings`: `_id` ('main'), `theme`, `accentColor`, `hero` (`headline`, `subtext`, `primaryCtaLabel`, `secondaryCtaLabel`, `showAvailabilityBadge`), `sections` ([{ `id`, `label`, `visible`, `order` }]), `footer` (`text`, `showAdminLink`), `ai` (`enabled`, `greeting`, `fallbackMessage`, `provider`), `seo` (`title`, `description`, `ogImageUrl`).

- [ ] **Step 5: Write and execute idempotent seed script (`src/scripts/seed.ts`)**
  Populate realistic default developer/designer data, 4 sample projects, 5 skill categories, and system settings.
  Run: `npx ts-node src/scripts/seed.ts` (or `node -r esbuild-register`) to verify database insertion.

---

## Task 3: Public API Endpoints with Caching & Projection

**Files:**
- Create: `src/app/api/profile/route.ts`
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/api/skills/route.ts`
- Create: `src/app/api/settings/route.ts`

**Interfaces:**
- Produces:
  - `GET /api/profile` -> Public profile metadata
  - `GET /api/projects` -> Published projects sorted by `order: 1`
  - `GET /api/skills` -> Skill categories sorted by `order: 1`
  - `GET /api/settings` -> Public display settings and section configurations

- [ ] **Step 1: Implement `GET /api/profile`**
  Fetch `Profile.findById('main')`. Return 200 with JSON or default fallback structure.

- [ ] **Step 2: Implement `GET /api/projects`**
  Fetch `Project.find({ status: 'published' }).sort({ order: 1 })`. Return lean JSON representation.

- [ ] **Step 3: Implement `GET /api/skills` and `GET /api/settings`**
  - Skills: Fetch and sort by `order: 1`.
  - Settings: Fetch `Settings.findById('main')`, stripping private credentials if any.

- [ ] **Step 4: Verify public API responses with automated route test or curl**
  Ensure response format strictly matches frontend consumer contracts.

---

## Task 4: NextAuth.js Admin Authentication & Protected Route Guards

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/middleware.ts`
- Create: `src/app/admin/login/page.tsx`

**Interfaces:**
- Produces: Admin session management, session guard on `/admin/*` and mutation APIs (`POST`, `PUT`, `DELETE`).
- Consumes: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`.

- [ ] **Step 1: Configure NextAuth Credentials Provider in `src/lib/auth.ts`**
  Validate user input against `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment variables using secure comparison. Configure JWT session strategy.

- [ ] **Step 2: Set up NextAuth handler in `src/app/api/auth/[...nextauth]/route.ts`**
  Export `GET` and `POST` handlers configured with NextAuth options.

- [ ] **Step 3: Implement route protection middleware in `src/middleware.ts`**
  Intercept requests to `/admin/:path*` (except `/admin/login`). Redirect unauthenticated sessions to `/admin/login`. Protect mutation APIs.

- [ ] **Step 4: Build Tactical Brutalist Admin Login Page (`src/app/admin/login/page.tsx`)**
  Design login terminal with monospace prompt (`[ SECURITY PROTOCOL: AUTHENTICATION REQUIRED ]`), clean inputs, loading indicator, and error states.

- [ ] **Step 5: Verify Login & Access Restrictions**
  Test correct credentials grant access to `/admin`, while incorrect credentials trigger rejection message.

---

## Task 5: Cloudinary Free-Tier Image Upload API

**Files:**
- Create: `src/lib/cloudinary.ts`
- Create: `src/app/api/upload/route.ts`
- Create: `src/components/admin/ImageUpload.tsx`

**Interfaces:**
- Produces: `POST /api/upload` endpoint returning `{ secure_url: string, public_id: string }`.
- Consumes: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

- [ ] **Step 1: Set up Cloudinary client in `src/lib/cloudinary.ts`**
  Initialize Cloudinary v2 SDK with credentials and validation checks.

- [ ] **Step 2: Implement upload API route in `src/app/api/upload/route.ts`**
  Validate admin session. Accept multipart `FormData`. Verify file type (`image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`) and file size limit (< 5MB for free tier). Stream to Cloudinary folder `portfolio/`. Return secure URL.

- [ ] **Step 3: Build reusable drag-and-drop ImageUpload component (`src/components/admin/ImageUpload.tsx`)**
  Display preview, upload progress indicator, remove button, and manual URL fallback input.

---

## Task 6: Admin Dashboard & Profile Editor

**Files:**
- Create: `src/components/layout/AdminNav.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/profile/page.tsx`
- Create: `src/components/admin/ProfileForm.tsx`

**Interfaces:**
- Produces: `PUT /api/profile` handler, Admin stats dashboard, Profile editing form.

- [ ] **Step 1: Create Admin Navigation HUD (`src/components/layout/AdminNav.tsx`)**
  Top bar with telemetry metrics (`[ STATUS: AUTHENTICATED ]`, `[ DB: CONNECTED ]`), links to Dashboard, Projects, Profile, Skills, Settings, Backup, View Site, and Logout.

- [ ] **Step 2: Build Admin Overview Dashboard (`src/app/admin/page.tsx`)**
  Display metric cards: Total Projects, Published, Featured, Skills Count, AI Status, Quick Actions.

- [ ] **Step 3: Build Profile Editor Form (`src/components/admin/ProfileForm.tsx`)**
  Form for Name, Role, Tagline, Short Bio, Long Bio, Design Philosophy, Location, Availability, Email, Socials, and Avatar Upload.

- [ ] **Step 4: Connect Profile Editor to `PUT /api/profile`**
  Save to MongoDB with toast notifications on success/error.

---

## Task 7: Project CRUD & Block-Based Case Study Editor

**Files:**
- Create: `src/app/admin/projects/page.tsx`
- Create: `src/app/admin/projects/new/page.tsx`
- Create: `src/app/admin/projects/[id]/edit/page.tsx`
- Create: `src/components/admin/ProjectForm.tsx`
- Create: `src/components/admin/BlockEditor.tsx`
- Create: `src/app/api/projects/[id]/route.ts`

**Interfaces:**
- Produces:
  - `POST /api/projects` -> Create project
  - `GET /api/projects/[id]` -> Fetch single project for editing
  - `PUT /api/projects/[id]` -> Update project
  - `DELETE /api/projects/[id]` -> Delete project

- [ ] **Step 1: Implement Project Mutation Endpoints (`src/app/api/projects/route.ts` & `[id]/route.ts`)**
  Validate session, sanitize inputs, auto-generate unique slug from title if not provided, handle deletions.

- [ ] **Step 2: Build Block-Based Case Study Editor (`src/components/admin/BlockEditor.tsx`)**
  Support blocks:
  - Heading (H2/H3)
  - Paragraph
  - Single Image (with Cloudinary upload & caption)
  - Image Gallery
  - Quote / Testimonial
  - Impact Metric (Label + Big Value)
  - External Link
  Include block reordering (up/down) and delete actions.

- [ ] **Step 3: Build Comprehensive Project Form (`src/components/admin/ProjectForm.tsx`)**
  Inputs for Title, Slug, Role, Year, Timeline, Summary, Tech Stack (tag input), Status (Draft/Published toggle), Featured toggle, Thumbnail upload, Gallery upload, Metrics, Process steps, and Case Study Blocks.

- [ ] **Step 4: Wire up Project Creation & Editing pages**
  Verify creating, editing, and deleting a project updates MongoDB accurately.

---

## Task 8: Drag-and-Drop Project Reordering with @dnd-kit

**Files:**
- Create: `src/components/admin/SortableProjectList.tsx`
- Create: `src/components/admin/SortableProjectItem.tsx`
- Create: `src/app/api/projects/reorder/route.ts`

**Interfaces:**
- Produces: `POST /api/projects/reorder` endpoint receiving `{ projectIds: string[] }`.
- Consumes: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.

- [ ] **Step 1: Implement Reorder API Endpoint (`src/app/api/projects/reorder/route.ts`)**
  Validate admin session. Loop through `projectIds` array and execute bulk write updating each project's `order` field to `index + 1`.

- [ ] **Step 2: Build Sortable Project Item component (`src/components/admin/SortableProjectItem.tsx`)**
  Use `useSortable` hook. Provide tactile drag handle, thumbnail, title, status pill, featured indicator, and accessible Up/Down buttons.

- [ ] **Step 3: Build Sortable Project List with optimistic UI (`src/components/admin/SortableProjectList.tsx`)**
  Implement `DndContext`, `SortableContext`, `closestCenter`, and pointer/keyboard sensors. Update state optimistically on drag end; trigger API call; rollback if API returns error.

---

## Task 9: Skills & Settings Managers

**Files:**
- Create: `src/app/admin/skills/page.tsx`
- Create: `src/components/admin/SkillsManager.tsx`
- Create: `src/app/api/skills/[id]/route.ts`
- Create: `src/app/api/skills/reorder/route.ts`
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/components/admin/SettingsForm.tsx`

**Interfaces:**
- Produces: Full Skill Category CRUD, Reordering, and Site-wide Settings Manager (Hero text, CTA labels, Accent color, AI parameters).

- [ ] **Step 1: Build Skills Manager Component (`src/components/admin/SkillsManager.tsx`)**
  Allow adding/editing/deleting skill categories (e.g. Design, Frontend, Tools) and chip-based items within each category.

- [ ] **Step 2: Build Site Settings Form (`src/components/admin/SettingsForm.tsx`)**
  Allow customizing Hero headline, subtext, CTA labels, accent color (with live color picker preview), availability badge toggle, section visibility checkboxes, footer text, and AI settings.

- [ ] **Step 3: Connect to `PUT /api/settings` and verify persistence**
  Ensure setting changes immediately reflect on the public site upon reload.

---

## Task 10: Public Website — Industrial Brutalist Homepage & Sections

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/home/Hero.tsx`
- Create: `src/components/home/FeaturedProjects.tsx`
- Create: `src/components/home/ProjectGrid.tsx`
- Create: `src/components/home/AboutSection.tsx`
- Create: `src/components/home/SkillsMarquee.tsx`
- Create: `src/components/home/ContactSection.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/ui/CommandPalette.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: Complete public homepage with telemetry layout, dynamic section ordering, and keyboard shortcut palette (`Cmd+K`).

- [ ] **Step 1: Build Telemetry Navbar (`src/components/layout/Navbar.tsx`)**
  Sticky header with 1px bottom border, Monospace logo/callsign, navigation links, live UTC time readout, `Cmd+K` palette trigger, and theme/status indicator.

- [ ] **Step 2: Build Industrial Hero Section (`src/components/home/Hero.tsx`)**
  High-impact macro-typography (`text-4xl md:text-6xl tracking-tight font-black uppercase`), live availability indicator (`[ SYSTEM: AVAILABLE FOR CONTRACT ]`), subtext, magnetic action buttons (`View Work`, `Contact`), and subtle telemetry coordinates.

- [ ] **Step 3: Build Featured Projects & All Projects Grid (`src/components/home/FeaturedProjects.tsx`, `ProjectGrid.tsx`)**
  Render projects in exact database `order`. Sharp 90-degree corners, 1px border grid, uppercase role tags, tech stack badges, hover image zoom, and direct link to case studies.

- [ ] **Step 4: Build About, Skills Marquee, and Contact Sections**
  - About: Two-column blueprint layout with bio, design philosophy, location, and social links.
  - Skills Marquee: Smooth infinite horizontal ticker pausing on hover.
  - Contact: Direct email button, availability status, and social link matrix.

- [ ] **Step 5: Build `Cmd + K` Command Palette (`src/components/ui/CommandPalette.tsx`)**
  Quick navigation to sections, projects, social profiles, and admin login.

---

## Task 11: Dynamic Case Study Detail Page (`/projects/[slug]`)

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`
- Create: `src/components/projects/CaseStudyRenderer.tsx`
- Create: `src/components/projects/ProcessTimeline.tsx`
- Create: `src/components/projects/MetricGrid.tsx`

**Interfaces:**
- Produces: SSR dynamic case study page at `/projects/[slug]` with custom SEO metadata.

- [ ] **Step 1: Implement Dynamic Route in `src/app/projects/[slug]/page.tsx`**
  Fetch project by slug from MongoDB. Return 404 (`notFound()`) if unpublished or missing. Generate dynamic SEO title and Open Graph tags.

- [ ] **Step 2: Build CaseStudyRenderer (`src/components/projects/CaseStudyRenderer.tsx`)**
  Modular renderer for case study blocks:
  - Headings with technical anchor IDs
  - Formatted paragraphs
  - High-res images with zoom overlay and captions
  - Multi-column image galleries
  - Pull quotes with industrial red border marks
  - Metric cards and external link buttons

- [ ] **Step 3: Build Process Timeline & Navigation (`src/components/projects/ProcessTimeline.tsx`)**
  Display step-by-step timeline (e.g. Discover -> Define -> Design -> Prototype -> Build) and previous/next project footer links.

---

## Task 12: Digital Twin AI Assistant (Free-Tier Streaming)

**Files:**
- Create: `src/lib/ai.ts`
- Create: `src/app/api/ai/chat/route.ts`
- Create: `src/components/ai/AssistantOrb.tsx`
- Create: `src/components/ai/ChatPanel.tsx`

**Interfaces:**
- Produces: Floating digital twin AI orb, expandable chat panel, streaming AI responses via Groq/Gemini.
- Consumes: `GROQ_API_KEY` or `GEMINI_API_KEY`, portfolio database context.

- [ ] **Step 1: Implement AI Provider Helper in `src/lib/ai.ts`**
  Support Groq SDK (Llama 3.3 70B Versatile, free tier) with fallback to Google Gemini Flash. If neither key is provided, return structured offline status.

- [ ] **Step 2: Implement Context Builder & Chat Route (`src/app/api/ai/chat/route.ts`)**
  Fetch current `Profile`, published `Project` summaries, and `Skill` list. Assemble strict system prompt instructing model to act as digital twin in first person, refusing to hallucinate unlisted work or disclose secrets. Stream response to client.

- [ ] **Step 3: Build Interactive Assistant Orb & Chat Panel (`src/components/ai/AssistantOrb.tsx`, `ChatPanel.tsx`)**
  Floating tactical orb with pulsing ping animation. Click expands into sliding brutalist terminal panel with greeting, suggested question chips, streaming message feed, and copy button.

- [ ] **Step 4: Verify AI fallback when offline or unconfigured**
  Ensure chat gracefully displays: "AI digital twin offline. Please explore projects or email directly."

---

## Task 13: Full Backup & Restore System (JSON Export / Import)

**Files:**
- Create: `src/app/api/export/route.ts`
- Create: `src/app/api/import/route.ts`
- Create: `src/app/admin/backup/page.tsx`
- Create: `src/components/admin/BackupManager.tsx`

**Interfaces:**
- Produces: Complete database snapshot export and single-click recovery for zero-loss portfolio management.

- [ ] **Step 1: Implement Export API (`src/app/api/export/route.ts`)**
  Validate admin session. Query `Profile`, `Project`, `Skill`, and `Settings`. Stream as formatted JSON attachment download.

- [ ] **Step 2: Implement Import API (`src/app/api/import/route.ts`)**
  Validate admin session. Validate JSON schema. Support overwrite mode to restore all collections atomically.

- [ ] **Step 3: Build Backup Manager UI (`src/app/admin/backup/page.tsx`)**
  Export button triggering instant `.json` download. Drag-and-drop file upload for restore with red confirmation modal.

---

## Task 14: End-to-End Verification, Performance & Deployment

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `.env.example`
- Create: `README.md`

- [ ] **Step 1: Configure Dynamic Sitemap & Robots (`src/app/sitemap.ts`, `src/app/robots.ts`)**
  Automatically generate sitemap including `/` and all published `/projects/[slug]` URLs.

- [ ] **Step 2: Verify Responsive Layout on Mobile Viewports**
  Validate mobile navigation drawer, touch controls, responsive typography clamping, and layout stability (`min-h-[100dvh]`).

- [ ] **Step 3: Execute Production Build & Type Check**
  Run: `npm run build`
  Verify zero TypeScript, ESLint, or CSS compiler errors.

- [ ] **Step 4: Prepare Vercel Free-Tier Deployment Configuration**
  Generate clean `.env.example` documenting all free-tier credentials (`MONGODB_URI`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_*`, `GROQ_API_KEY`). Provide detailed README deployment steps.

---

## Verification Plan

### Automated Tests
- TypeScript type-checking: `npx tsc --noEmit`
- Next.js production build: `npm run build`
- API Route integrity check: Query all public and protected endpoints to verify status codes and payloads.

### Manual Verification Flow
1. **Public Site:** Open homepage -> verify hero text, project order, skills marquee, and responsive layout.
2. **Project Detail:** Click project card -> verify slug route `/projects/[slug]` loads case study blocks.
3. **Admin Auth:** Navigate to `/admin` -> verify redirect to `/admin/login`. Log in with credentials.
4. **Project Drag-and-Drop:** Drag project to new position in `/admin/projects` -> refresh page -> verify order persisted. Check homepage to verify public order matches.
5. **Image Upload:** Upload image in project editor -> verify image uploads to Cloudinary and preview displays.
6. **AI Assistant:** Click AI Orb -> click sample question -> verify streaming first-person response.
7. **Backup & Restore:** Download JSON export -> modify a field -> restore JSON -> verify field reverts.
