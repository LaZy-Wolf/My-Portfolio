# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two readers, in order:

1. **Recruiters and talent partners** skimming a candidate link from LinkedIn or a resume, usually on a laptop during the working day. They give it about a minute. They need: who this is, what role he fits, proof he ships real things, and how to reach him.
2. **Engineers and hiring leads** (interviewers, founders, AI team leads) who come back to dig. They open one or two case studies and judge the engineering: architecture, trade-offs, measured results, and honesty about what did not work.

The site must serve both layers: a fast, legible top layer for the skim, and deep, technical case studies for the dig.

## Product Purpose

Personal portfolio of Gugulothu Akhil Kumar, AI & Full-Stack Engineer (Hyderabad, India). Its job is to get him hired into full-time GenAI engineering roles. Success: a recruiter forwards the link; an engineer reads a case study and books a call.

The portfolio is itself a product: a Next.js + MongoDB site with an admin CMS, drag-and-drop project ordering, block-based case studies, a command palette, and an AI "digital twin" chat grounded in the portfolio data.

## Positioning

He measures his systems and publishes the results, including the misses. His READMEs carry real latency budgets (SONAR: time to first audio p50 1412 ms, target 900 ms, "no"), real retrieval evals (ASOC: recall@5 0.932 on a 91-question golden set), and design decisions justified by evidence ("Nemotron was demoted on evidence"). Most junior AI portfolios claim; this one shows its measurements. That honesty is the differentiator a neighbouring portfolio cannot truthfully copy.

## Operating Context

- Visitors arrive from LinkedIn, resume PDFs, GitHub, and cold outreach.
- Deep readers cross-check claims against the linked GitHub repos, so every number on the site must match the repo.
- SONAR has a live demo (sonar-voice-agent.vercel.app) where visitors can talk to the agent; cold start takes 10 to 20 seconds.
- Content is edited through /admin and stored in MongoDB; images go to Cloudinary. Hosting targets Vercel free tier.

## Capabilities and Constraints

- Stack is fixed: Next.js 15 App Router, TypeScript, Tailwind CSS 3, motion, Lenis, Mongoose, NextAuth, dnd-kit, Groq/Gemini.
- Zero-cost constraint: free tiers only.
- All public content must stay editable from the admin panel (no hard-coded portfolio content in components).
- The AI assistant must answer only from portfolio data and must degrade gracefully when keys are missing.
- Projects shown (confirmed): SONAR, ASOC, LUMINA, MAIRA (featured tier), ClearCue, AK-9, Serverless Email API (secondary tier).
- Portrait: undecided. He will supply a real photo later via admin; until then the site shows a designed no-photo state. Never use stock people.

## Brand Commitments

- Name: Gugulothu Akhil Kumar. Role line: AI & Full-Stack Engineer.
- GitHub handle LaZy-Wolf. Email enigmasrealm77@gmail.com. LinkedIn in/akhil-kumar9.
- Voice: plain, precise, first person, evidence first. Short sentences. No hype words, no telemetry cosplay ("SECTOR 02", "TRANSMISSION GATEWAY", "OPERATOR"), no em dashes.

## Evidence on Hand

- Resume PDF (C:\Users\gugul\Videos\Akhil_Kumar_Resume.pdf): experience at Allcognix AI (GenAI Full-Stack Engineer Intern, Nov 2025 to present, 4+ production AI products), B.Tech CSE (AI & ML), Malla Reddy University, 2022 to Jun 2026, CGPA 8.6; hackathon results; certifications.
- GitHub READMEs are the source of truth for every project claim (confirmed by the owner):
  - Sonar-Voice-Agent: measured latency table, stack (LiveKit, Deepgram nova-3, Groq gpt-oss-20b with OpenRouter and NVIDIA fallback, Cartesia Sonic, Twilio SIP, FastMCP over SQLite), 59 unit tests, live demo.
  - ASOC (Agentic Support & Operations Copilot): retrieval eval table (dense 0.864, hybrid RRF 0.907, hybrid + rerank 0.932 recall@5), durable human approval gate, 8 MCP tools, Qdrant, bge reranker.
  - LUMINA: multimodal misinformation tool (FastAPI, LangChain, Groq, Gemini, Mistral OCR, Tavily).
  - MAIRA: multi-agent research assistant, tiered research, verification loop, LaTeX reports, Supabase PGVector RAG.
  - ClearCue, AK NINE, serverless-email-api READMEs.
- Absent, must not be fabricated: testimonials, client logos, a portrait, product screenshots of Allcognix work, any metric not in a README or the resume. The "95% classification accuracy" for LUMINA comes from the resume only; keep it attributed to the resume wording, not embellished.

## Product Principles

1. Prove, don't claim: every number links back to where it was measured.
2. Two depths: a one-minute skim that lands, and case studies that survive an expert's cross-check.
3. The site is a work sample: its own craft (speed, motion, accessibility, admin) is part of the pitch.
4. Plain words over jargon costume.
5. Editable forever: the owner changes content in /admin, never in code.

## Accessibility & Inclusion

WCAG 2.1 AA: visible focus, keyboard reachable palette and chat, reduced-motion support, sufficient contrast, no custom cursor on touch.
