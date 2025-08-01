# Visa Component Suggestion Tool

A full-stack web application that recommends Visa Product Design System (PDS) components using rule-based matching and OpenAI API integration.

I built a full-stack application with a React 19 + TypeScript frontend and an Express.js + OpenAI-powered backend. On the frontend, I created an interactive UI where users can input design prompts, upload frontend files, and receive component suggestions through either rule-based keyword matching or AI integration. I implemented a typewriter effect, live JSX preview using react-live, and dark mode support with TailwindCSS and Visa’s Nova Design System. On the backend, I developed a Node.js Express server that serves a mock dataset of Visa components via /api/components, and processes AI suggestions via /api/suggest by sending user input to OpenAI’s GPT-3.5 model and formatting the response as structured JSON. The backend includes fallback parsing logic, server-side logging of AI responses, and returns clean JSX component suggestions for real-time rendering on the frontend.

**Live Demo:** [https://component-suggestion-uiux-marin.vercel.app/](https://component-suggestion-uiux-marin.vercel.app/)  
_Note: Backend cold start may take ~50 seconds_

## ⚙️ Tech Stack

**Frontend:** React 19, TypeScript, Vite, TailwindCSS, Visa Nova Design System  
**Backend:** Node.js, Express.js, OpenAI API  
**Preview:** react-live for safe JSX rendering

## 🚀 Quick Start

```bash
# Clone and install dependencies
npm install
cd backend && npm install

# Configure environment
cd backend && touch .env
# Add: OPENAI_API_KEY=your_key_here

# Run application
cd backend && node index.js    # Terminal 1
npm run dev                    # Terminal 2
```

## ✨ Key Features

- **Dual Suggestion Modes:** Local keyword matching + AI-powered suggestions
- **Live Preview:** Safe JSX rendering with `react-live`
- **File Attachment:** Upload multiple files for AI analysis
- **Interactive UI:** Typewriter animations, copy-to-clipboard, responsive design
- **Smart UX:** Context-aware button states and error handling

## 🏗️ Architecture Highlights

**Frontend Security:** Scoped `react-live` preview to `@visa/nova-react` components only  
**Backend Safety:** API key protection with structured JSON responses from OpenAI  
**Mock Data:** Curated dataset simulating real Visa PDS components

## 📎 Recent Updates (08.01.2025)

Added comprehensive file attachment system with:

- Multiple file type support (`.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.css`, etc.)
- Smart button state management (disables "Suggest Components" when files attached)
- Interactive hover modals with contextual messaging
- Visual file management with removable tags

Enhanced Background Animation System:

Implemented a dynamic background system using pure CSS that combines hue-shifting, blur, and opacity breathing effects. The animation uses GPU-accelerated filter and transform properties to smoothly rotate colors, apply a soft blur (2–5px), and modulate transparency over time—all while adapting to light and dark mode themes. The gradient is rendered behind all content (z-index: -1) with pointer-events: none to ensure performance and non-intrusiveness, delivering an ambient, responsive visual experience without JavaScript.

Intelligent Autocomplete System: 

I implemented an intelligent autocomplete system that saves user input history to localStorage and provides real-time suggestions as they type in the text box. The system filters through previously entered queries to show relevant suggestions below the textarea, allowing users to quickly reuse or modify past successful searches using keyboard navigation (arrow keys, Enter) or mouse clicks. This feature enhances user experience by reducing repetitive typing and helping users discover effective prompts they've used before, while automatically building a personalized suggestion database of up to 50 recent entries.

---

## 🤖 AI Usage Philosophy

> **AI was used strictly as a pair programming assistant:**

- **Drafted architectural scaffolding** and brainstorming flow logic
- **Assisted with prompt engineering** to improve suggestion quality
- **Contributed to documentation** and copywriting cleanup

**Core decisions, architecture setup, data modeling, error handling, and UI composition were engineered manually, with AI offering guidance rather than driving implementation.**

## Next Steps (If More Time):

### 🧪 Testing & Quality

- Unit tests for backend routes with Jest/Supertest, ensuring stability and correctness in the OpenAI integration and component suggestion routes
- End-to-end testing with Playwright for user workflows (file upload → AI suggestion → preview)
- Performance testing for AI response times and concurrent user handling

### 🔒 Security & Validation

- Implement stricter validation for AI suggestions by cross-checking AI responses with the mock dataset or Nova React component scope before live rendering
- Add file type validation and malware scanning for uploaded files
- Rate limiting and request throttling to prevent API abuse

### ⚡ Performance & Scalability

- Implement caching (e.g., with Redis or in-memory caching) for repeated AI prompt results to reduce API calls and improve response speed
- Add streaming responses for real-time AI suggestion generation
- Optimize bundle size and implement code splitting for faster load times

### 🚀 DevOps & Infrastructure

- Containerize the backend with Docker and set up proper CI/CD workflows via GitHub Actions for deployments to Render or Railway
- Add monitoring and logging with tools like Sentry or LogRocket
- Implement health checks and graceful shutdown handling

### ✨ Enhanced Features

- Voice input integration using Web Speech API for hands-free component requests
- Component variation suggestions (different sizes, themes, states)
- Export functionality to generate complete component libraries
- Integration with design tools (Figma plugin, Sketch extension)
- Multi-language support for international Visa teams

### 📊 Analytics & Insights

- Usage analytics to track most requested component types
- A/B testing framework for suggestion accuracy improvements
- User feedback collection and suggestion quality scoring

## Deployment

Vercel Deployment Link (Full Stack -- Backend on Render): https://component-suggestion-uiux-marin.vercel.app/
OPENAI backend to connect with Frontend might take about 50seconds!

## Example Prompts

### TextField (keywords: text, input, email, password):

- “Password input field with show/hide option” → causes preview error on purpose in AI suggest mode

### Button (keywords: button, submit, click):

- “Clickable button to add an item to cart” → live preview available in AI suggest mode

### Checkbox (keywords: checkbox, remember, check):

- “Remember me checkbox below login form” → 　 live preview available in AI suggest mode

### IF IN CASE OF ABNORMAL SITUATION (Edge Cases):

- Text input over 500 words → Alert: word count exceeded
- Too many components → 　 scrollable
- If no components found → 　 Alert: no components found
