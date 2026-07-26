# ResumeForge AI

> **Upload your career. Target the job. Build the right resume.**

A production-quality AI-powered resume builder that consolidates multiple historical resumes into a verified Career Profile, then generates tailored, ATS-friendly resumes for specific job descriptions.

## Features

- 📄 Upload up to 10 resumes (PDF/DOCX) - AI extracts and consolidates everything
- 🧠 Persistent Career Profile - never re-enter your information
- 🎯 JD-Specific tailoring - different resumes for different jobs
- ✅ Anti-hallucination AI - NEVER invents experience you don't have
- 🔍 ATS-Readiness analysis across 10 dimensions
- 🖼️ 6 ATS-safe professional templates
- ✏️ Live 3-panel resume editor with AI bullet improvements
- 📅 PDF & DOCX export
- 🔄 Resume version management
- 🔒 Privacy-first - your data stays yours

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **AI**: Groq API (llama-3.3-70b-versatile)
- **PDF Export**: @react-pdf/renderer
- **DOCX Export**: docx
- **Deploy**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) account (free)
- A [Groq](https://console.groq.com) API key (free)
- A [Vercel](https://vercel.com) account (free)

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env.local`
4. Fill in your API keys in `.env.local`
5. Push database schema: `npx prisma db push`
6. Run development server: `npm run dev`
7. Open http://localhost:3000

### Environment Variables

```env
NEXTAUTH_SECRET=          # Generate with: openssl rand -base64 32
NEXTAUTH_URL=             # http://localhost:3000 (or your domain)
DATABASE_URL=             # Neon PostgreSQL connection string
GROQ_API_KEY=             # From console.groq.com
GOOGLE_CLIENT_ID=         # From Google Cloud Console (optional)
GOOGLE_CLIENT_SECRET=     # From Google Cloud Console (optional)
BLOB_READ_WRITE_TOKEN=    # From Vercel Blob settings
NEXT_PUBLIC_APP_URL=      # Your app URL
```

## Deploying to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add all environment variables in Vercel dashboard
4. Enable Vercel Blob in Storage settings
5. Deploy!

## Architecture

The AI pipeline runs in stages:
1. Document Parsing (PDF/DOCX → text)
2. Structured Extraction (AI → Career Profile JSON)
3. Multi-Resume Merge & Conflict Detection
4. JD Analysis (requirements, keywords, weights)
5. Candidate-JD Matching (strong/partial/missing)
6. Resume Generation (ONLY from verified profile)
7. Grounding Validation (every claim traced)
8. ATS Analysis (10 scoring dimensions)

## Anti-Hallucination Guarantee

ResumeForge AI will NEVER invent:
- Companies, dates, metrics
- Skills not in your profile
- Projects you didn't work on
- Certifications you don't have

If AI suggests a metric, you are asked to confirm it.

## Important Note on ATS Scores

The Resume Readiness Score is an **estimated** score based on best practices. Different employers use different ATS software with different configurations. We never claim "100% ATS Guaranteed" or "Guaranteed Interview."

## License

MIT
