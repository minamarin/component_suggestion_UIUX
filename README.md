# Visa Component Suggestion Tool

A full-stack web application that recommends Visa Product Design System (PDS) components using rule-based matching and OpenAI API integration.

**Live Demo:** [component-suggestion-uiux-v9ya.vercel.app](https://component-suggestion-uiux-v9ya.vercel.app/)  
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

## 📝 Example Usage

**Text Input:** "Password input field with show/hide option"  
**Button:** "Clickable button to add an item to cart"  
**Checkbox:** "Remember me checkbox below login form"

## 📎 Recent Updates (08.01.2025)

Added comprehensive file attachment system with:

- Multiple file type support (`.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.css`, etc.)
- Smart button state management (disables "Suggest Components" when files attached)
- Interactive hover modals with contextual messaging
- Visual file management with removable tags

---

### Backend Architecture

#### - **Backend-Orchestrated AI Calls**

I chose to handle OpenAI API calls on the backend (Node.js Express) to protect sensitive API keys and validate AI responses before exposing them to the frontend. This architecture also gave me flexibility for future enhancements like caching or request throttling.

#### - **Mock Dataset Integration**

Given that the real Visa PDS components are behind internal access walls, I created a mock dataset (`components.json`) to replicate realistic component suggestions. This allowed me to demonstrate both keyword matching and AI-driven suggestions without scraping or unauthorized access.

#### - **Validation Strategy for AI Output**

I designed the system to optionally validate AI-suggested components against my known mock dataset before rendering. While basic checks were implemented, I noted this as an area for future development, especially for enterprise use cases where hallucination prevention is critical.

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

Vercel Deployment Link (Full Stack -- Backend on Render): https://component-suggestion-uiux-v9ya.vercel.app/
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
