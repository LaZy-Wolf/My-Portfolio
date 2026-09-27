# Living Canvas Portfolio

Portfolio of Gugulothu Akhil Kumar, built with Next.js 15, Tailwind CSS, MongoDB Atlas, Cloudinary and Groq/Gemini. The public site is designed as a transit map: every project is a line, every stop a measured pipeline stage. See `DESIGN.md` for the system and `PRODUCT.md` for the product brief.

**Budget:** 100% Free Tier ($0.00 / forever).

---

## Architecture & Free-Tier Services

| Layer | Technology | Free Tier Provider | Limits |
|---|---|---|---|
| **Framework** | Next.js 15 (App Router, TS) | Vercel Free / Hobby | 100GB Bandwidth / Mo |
| **Database** | MongoDB Atlas | Free Cluster (M0) | 512 MB Storage, 500 Conns |
| **Media CDN** | Cloudinary Free Tier | Cloudinary | 25 Credits/Mo (~25GB storage) |
| **Auth** | NextAuth.js (JWT) | Open Source / Local | Unlimited |
| **AI Digital Twin** | Groq SDK (Llama 3.3 70B) | Groq Console | Generous Free RPM/RPD |
| **Motion & Scroll** | Motion (Framer) + Lenis | Open Source | Unlimited |
| **Drag & Drop** | `@dnd-kit/core` & `@dnd-kit/sortable` | Open Source | Accessible & Touch-enabled |

---

## Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <your-repo>
cd PortfolioNow
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Key environment variables:
```env
# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolionow?retryWrites=true&w=majority

# NextAuth Secret & Single Admin Credentials
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_long_random_secret_string
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=AdminSecurePassword2026!

# Cloudinary Free Tier (Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Digital Twin (Free Groq or Gemini)
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Seed Database (Optional)
Write the content in `src/content/portfolio.json` to MongoDB (reads `.env.local`; replaces projects and skills):
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the control panel.

---

## Admin Portal Features (`/admin`)

- **Overview Dashboard:** Live telemetry metrics, project publication states, and quick actions.
- **Drag-and-Drop Project Manager:** Instant reordering via mouse or accessible up/down arrow buttons with immediate MongoDB synchronization.
- **Modular Case Study Builder:** Create rich case studies without touching code using Headings, Deep-dive Paragraphs, High-Res Images, Pull Quotes, Impact Metrics, and External Links.
- **Profile & Philosophy Editor:** Update name, roles, availability banner, manifesto, avatar, and social links.
- **Taxonomy & Skills Manager:** Categorize competencies and manage the autonomic moving marquee ticker.
- **Site Parameters & AI Settings:** Calibrate accent color, hero headlines, section visibility toggles, and digital twin AI keys.
- **Disaster Recovery Backup:** Instant 1-click JSON export snapshot and atomic database restoration.

---

## Production Deployment to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, paste all values from `.env.local`:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel URL e.g. `https://your-portfolio.vercel.app`)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `GROQ_API_KEY` or `GEMINI_API_KEY`
5. Click **Deploy**. Your portfolio is live in under 60 seconds.
