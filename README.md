# TIDE 🌊 — This Too Shall Pass

**Your AI Emotional Support Companion for the Workplace**

> Work is stressful. Life is messy. Let's talk. This too shall pass.

TIDE is an AI companion specifically designed for office workers who need someone to talk to — whether it's about toxic managers, office politics, burnout, relationships, or just a rough day.

## ✨ Features

1. **AI Chat + Voice** — Talk to your buddy via text or voice. Natural, empathetic conversations powered by OpenAI.
2. **Life–Work Stress Map** — Visualize how your stressors connect across work, relationships, family, and personal life.
3. **Manager Twin** — Practice tough conversations with a fictional manager, or roast them in Roast Mode 🔥
4. **Emergency Relief** — Quick 2-minute guided support when you need a break RIGHT NOW.
5. **Reality Check** — Separate what happened from what you're assuming, and find a practical next step.
6. **Personal Recovery Lab** — Track your mood, view trends, and get AI-powered reflections.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- OpenAI API key
- Smallest AI API key (for voice features)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd office-buddy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file with:

```env
OPENAI_API_KEY=your_openai_api_key_here
SMALLEST_API_KEY=your_smallest_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 (App Router) | Frontend + API routes |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| OpenAI API | AI conversations & insight extraction |
| Smallest AI (Pulse) | Speech-to-text |
| Smallest AI (Lightning) | Text-to-speech |
| Recharts | Mood trend charts |
| Lucide React | Icons |
| localStorage | Client-side data storage |

## 🔒 Privacy & Safety

- **Not therapy.** Office Buddy is emotional support, not a licensed therapist.
- **Local storage only.** All data is stored in your browser. No server-side databases.
- **User-controlled.** Delete your chat history and insights anytime.
- **API keys server-side.** Your API keys are never exposed to the browser.
- **Crisis support.** For serious distress, we encourage reaching out to the 988 Suicide & Crisis Lifeline.

## 📦 Deployment (Vercel)

```bash
# Build for production
npm run build

# Or deploy to Vercel
npx vercel --prod
```

Set your environment variables in the Vercel dashboard before deploying.

## 🎯 Hackathon Demo Flow

1. Open the website → Show the hero image and tagline
2. Click "Talk to your Buddy" → Start a conversation about work stress
3. Use the microphone → Demonstrate voice input
4. Show the dashboard → Stress map, mood chart, reflections
5. Open Manager Twin → Roast Mode for a hilarious demo
6. Show Emergency Relief → Quick calming exercise
7. Show Reality Check → Facts vs. assumptions analysis

---

*Built with ❤️ for people who deserve to be heard.*
