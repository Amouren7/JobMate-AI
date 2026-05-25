# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JobMate AI 职伴 is a pure frontend AI-powered job search assistant application. It helps job seekers with resume optimization, JD (job description) analysis, and interview preparation using AI services.

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 8.x
- **UI Library**: Ant Design 6.x
- **Styling**: TailwindCSS 3.x + CSS
- **Routing**: React Router v7

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Running the Production Build

The `dist/` folder contains pre-built production files that can be served directly:

```bash
cd dist
python -m http.server 8080 --bind 127.0.0.1
# or
npx serve -l 8080
```

## Project Structure

```
JobMate-AI/
├── src/
│   ├── components/
│   │   └── Layout/          # Main layout with sidebar navigation and user auth
│   ├── pages/               # Page components
│   │   ├── Home/            # Landing page
│   │   ├── Login/           # Login page (no Layout wrapper)
│   │   ├── ResumeOptimize/  # Resume optimization with AI
│   │   ├── JDAnalyze/         # JD matching analysis + cover letter generation
│   │   ├── InterviewPrep/   # Interview preparation
│   │   ├── Applications/      # Job application tracking + reminders
│   │   ├── Dashboard/         # Data dashboard
│   │   └── Settings/        # AI provider configuration
│   ├── services/
│   │   └── ai.ts            # AI API service layer (DashScope, OpenAI, Claude, Custom)
│   ├── types/
│   │   ├── ai.ts            # AI config types and LocalStorage helpers
│   │   ├── user.ts          # User auth types
│   │   └── application.ts   # Job application types + LocalStorage helpers
│   ├── App.tsx              # Routes configuration
│   └── main.tsx             # Entry point
├── dist/                    # Production build output
├── docs/                    # Documentation
└── package.json
```

## Key Architecture Decisions

### AI Service Layer (`src/services/ai.ts`)

The AI service abstracts multiple providers behind a unified interface:
- **DashScope**: Alibaba Cloud's Qwen models (domestic China access)
- **OpenAI**: GPT series (requires overseas network or proxy)
- **Claude**: Anthropic's Claude models
- **Custom**: OpenAI-compatible APIs (OneAPI, New API, etc.)

Configuration is stored in browser LocalStorage (`jobmate_ai_config`) and loaded at runtime.

### Authentication Flow

Simple client-side auth using LocalStorage:
- `jobmate_user`: stores user info
- `jobmate_auth`: stores auth state
- Multi-tab sync via `window.addEventListener('storage')`
- Protected routes redirect to `/login`

### Routing Structure

Routes in `App.tsx`:
- `/login` - Login page (no Layout wrapper)
- `/` - Home
- `/resume` - Resume optimization
- `/jd` - JD analysis + AI cover letter generation
- `/interview` - Interview preparation
- `/applications` - Job application tracking with smart reminders
- `/dashboard` - Data dashboard
- `/settings` - AI configuration

### Styling Approach

- **TailwindCSS**: Utility classes for layout and quick styling
- **Ant Design**: Component library for forms, tables, modals
- **CSS files**: Component-specific styles in `style.css` adjacent to components

## Configuration Files

- `vite.config.ts`: Vite with React plugin, base path set to `./` for relative asset loading
- `tailwind.config.js`: Standard Tailwind with content paths configured
- `tsconfig.app.json`: TypeScript with ES2023 target, React JSX transform
- `eslint.config.js`: ESLint with TypeScript, React Hooks, and Refresh plugins

## Important Notes

- **CORS Issues**: Direct API calls to OpenAI/Claude from browser may fail due to CORS. Recommend users set up a proxy or use DashScope for domestic China access.
- **API Key Storage**: Keys are stored only in browser LocalStorage, never sent to any server.
- **AI Response Format**: The app expects JSON responses from AI. If parsing fails, it extracts JSON from markdown code blocks using regex.
- **Mock Data**: `src/mock/data.ts` contains fallback data for testing when AI is not configured.

## Testing AI Integration

To test AI functionality:

1. Configure AI provider in Settings page (`/settings`)
2. Use these test flows:
   - Resume Optimize: Paste resume text → Click "开始 AI 分析"
   - JD Analyze: Paste job description → Click "开始 AI 分析"
   - Interview Prep: Enter company name → Click "生成 AI 情报报告"

## Environment Variables

Copy `.env.example.evn` to `.env` for local environment configuration:

```bash
# Example .env file
VITE_APP_TITLE=JobMate AI
```

Note: Since this is a pure frontend app, env vars must start with `VITE_` to be exposed to the client.
