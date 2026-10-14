# 🎨 ComicGenie — AI-Powered Educational Comic Generator

> Turn any educational topic into a fully illustrated comic strip using AI


## 📖 About

ComicGenie is a full-stack web application that converts any educational topic into a fully illustrated, multi-page comic strip using Artificial Intelligence. Built for students aged 10-16, it makes learning visual, engaging, and fun.

**How it works:**
1. User types a topic (e.g. "Photosynthesis", "Newton's Laws", "Water Cycle")
2. Groq AI (LLaMA 3.3 70B) writes the full comic script with dialogue and narration
3. HuggingFace FLUX.1-schnell model draws each panel illustration
4. Comic renders in browser — download as PNG or PDF

---

## ✨ Features

- 🤖 AI-generated comic scripts with real science formulas and equations
- 🎨 AI-generated panel illustrations (FLUX.1-schnell model)
- 👤 User authentication — Signup, Login, Forgot Password
- 🔒 Password strength checker with live validation
- 🛡️ Security question for password recovery
- 🖼️ 4 art styles — Comic Book, Manga, Watercolor, Sketch
- 📚 9 subjects — Science, History, Mathematics, Geography, Biology, Physics, Chemistry, Literature, Economics
- 📄 Flexible layout — 2, 3, or 4 panels per page
- 💾 Download as PNG or PDF
- 📱 Responsive design

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 + React 18 | Full-stack framework |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and layout |
| Groq API (LLaMA 3.3 70B) | AI story/script generation |
| HuggingFace Router API | AI image generation |
| FLUX.1-schnell | Image generation model |
| html2canvas | PNG download |
| jsPDF | PDF download |
| localStorage | User authentication |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher — [nodejs.org](https://nodejs.org)
- VS Code — [code.visualstudio.com](https://code.visualstudio.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/comicgenie.git
cd comicgenie
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
```

Open `.env.local` and add your API keys:
```env
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here
HUGGINGFACE_MODEL=black-forest-labs/FLUX.1-schnell
```

**4. Run the development server**
```bash
npm run dev
```

**5. Open in browser**
```
http://localhost:3000
```

---

## 🔑 Getting Free API Keys

### Groq API (Story Generation)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)
5. Free tier: 14,400 requests/day

### HuggingFace (Image Generation)
1. Go to [huggingface.co/join](https://huggingface.co/join)
2. Create a free account
3. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
4. Click **New token** → Role: **Read** → Copy
5. Free monthly credits included

---

## 📁 Project Structure

```
comicgenie/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main comic generator page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── login/page.tsx              # Login page
│   │   ├── signup/page.tsx             # Signup page
│   │   ├── forgot-password/page.tsx    # Password reset page
│   │   └── api/
│   │       ├── generate-story/         # Groq AI API route
│   │       └── generate-images/        # HuggingFace API route
│   ├── components/
│   │   ├── AuthGuard.tsx               # Route protection
│   │   ├── ComicPageView.tsx           # Comic page renderer
│   │   ├── ComicPanelView.tsx          # Single panel renderer
│   │   └── DownloadButton.tsx          # PNG/PDF download
│   ├── lib/
│   │   ├── auth.ts                     # Authentication logic
│   │   └── comic-utils.ts              # Helper functions
│   └── types/
│       └── comic.ts                    # TypeScript interfaces
├── .env.example                        # Environment variables template
├── .env.local                          # Your API keys (not committed)
├── package.json
└── README.md
```

---

## 📸 Screenshots

> Login Page → Signup with password strength checker → Comic Generator → Generated Comic → Download

---

## 🎯 Educational Impact

Based on **Dual Coding Theory** (Paivio, 1971) — combining verbal and visual information improves memory retention significantly.

- 65% of people are visual learners
- Comics improve information retention compared to text alone
- Sequential visual storytelling mirrors how the brain builds mental models

---

## 🔮 Future Scope

- [ ] Save comics to user profile with database
- [ ] Support Hindi and other Indian languages
- [ ] NCERT/CBSE curriculum alignment
- [ ] Quiz generation after each comic
- [ ] Mobile app (React Native)
- [ ] Teacher dashboard

---

## ⚠️ Important Notes

- Never commit `.env.local` — your API keys must stay private
- HuggingFace free tier has monthly credit limits — create new account when depleted
- Groq free tier has rate limits — app automatically retries if limit hit

---

## 📚 References

- Meta AI — LLaMA 3.3 70B — [ai.meta.com](https://ai.meta.com)
- Black Forest Labs — FLUX.1-schnell — [huggingface.co/black-forest-labs](https://huggingface.co/black-forest-labs)
- Groq Cloud API — [console.groq.com](https://console.groq.com)
- HuggingFace — [huggingface.co](https://huggingface.co)
- Next.js — [nextjs.org](https://nextjs.org)
- Paivio, A. (1971). Dual Coding Theory

---

