# WhatsApp Pentest Simulator - Frontend Development Roadmap

**For:** Claude (Frontend Developer)  
**Priority:** High - Begin immediately  
**Estimated Timeline:** 3-4 days  
**Status:** Ready to start  

---

## 🎯 **OVERVIEW**

Transform the "educational follet" into a professional terminal-style pentest simulator with Spanish authenticity.

**Key Transformation Points:**
1. **Professional Aesthetic** → Dark terminal, ANSI colors, no "newbie" labels
2. **Spanish Data** → Realistic names, locations, chat patterns
3. **Real-time Simulation** → Attack logs with realistic delays
4. **Educational → Professional** → Security training tool, not tutorial

---

## 📋 **CORE REQUIREMENTS**

### **✅ MUST HAVE:**
1. **Terminal Interface** - xterm.js with dark theme
2. **Phone Number Input** - Spanish (+34) validation
3. **Attack Controls** - Buttons for RECON, SIM SWAP, WEB HIJACK
4. **Real-time Logs** - ANSI colored attack progression
5. **Victim Dashboard** - Spanish victim data display
6. **Legal Disclaimers** - Prominent educational warnings

### **📈 NICE TO HAVE:**
1. Keyboard shortcuts (Ctrl+R for recon, etc.)
2. Export attack logs (text file)
3. Session persistence (localStorage)
4. Multiple language support (Spanish/English)
5. Attack history timeline

---

## 🗓️ **DAY-BY-DAY PLAN**

### **DAY 1: Foundation & Setup**
**Goal:** Basic terminal interface with API integration

**Tasks:**
1. **Project Setup** (2 hours)
   - Create React + TypeScript + Vite project
   - Install dependencies: xterm.js, axios, Tailwind CSS
   - Configure project structure

2. **Terminal Component** (3 hours)
   - Implement xterm.js with dark theme
   - Create log display with ANSI color support
   - Add auto-scroll and clear functionality

3. **API Integration** (3 hours)
   - Create API client service
   - Implement phone number validation (+34 format)
   - Connect to `/attack/recon` endpoint
   - Display basic reconnaissance results

**Deliverables:**
- ✅ Terminal displaying "WhatsApp Pentest Simulator v1.0.0"
- ✅ Phone input with Spanish validation
- ✅ RECON button that calls API and displays results
- ✅ Basic log output with timestamps

---

### **DAY 2: Attack Simulation & Victim Data**
**Goal:** Complete attack flow and victim dashboard

**Tasks:**
1. **Attack Controls** (3 hours)
   - Implement SIM SWAP and WEB HIJACK buttons
   - Create attack status polling mechanism
   - Display real-time attack progression logs

2. **Victim Dashboard** (4 hours)
   - Design split-panel layout (terminal left, dashboard right)
   - Implement chat viewer with Spanish messages
   - Create contact list with realistic Spanish names
   - Add media gallery (placeholder images)

3. **State Management** (2 hours)
   - Implement Zustand store for attack state
   - Manage logs, victim data, and attack status
   - Add loading states and error handling

**Deliverables:**
- ✅ Complete attack flow (RECON → SIM SWAP → Victim Data)
- ✅ Split-panel layout with terminal and dashboard
- ✅ Spanish victim data displayed (chats, contacts, location)
- ✅ Real-time attack logs with ANSI colors

---

### **DAY 3: Polish & Professionalization**
**Goal:** Professional terminal aesthetic and UX polish

**Tasks:**
1. **UI Polish** (3 hours)
   - Implement professional color scheme (dark green terminal)
   - Add subtle animations and transitions
   - Create loading spinners and progress indicators
   - Ensure responsive design (desktop first)

2. **Keyboard Navigation** (2 hours)
   - Add keyboard shortcuts (Tab, Enter, Escape)
   - Implement command history (↑/↓ arrows)
   - Add focus management between panels

3. **Error Handling** (2 hours)
   - Graceful API error display in terminal format
   - Retry mechanisms for failed attacks
   - Connection status indicator
   - Rate limit handling

4. **Legal Compliance** (1 hour)
   - Add prominent security disclaimer on all screens
   - Include educational purpose statement
   - GDPR notice for synthetic data

**Deliverables:**
- ✅ Professional terminal aesthetic (Metasploit-inspired)
- ✅ Keyboard shortcuts and navigation
- ✅ Comprehensive error handling
- ✅ Legal disclaimers on every screen

---

### **DAY 4: Testing & Deployment**
**Goal:** Final testing and production deployment

**Tasks:**
1. **Integration Testing** (3 hours)
   - Test all API endpoints with Spanish phone numbers
   - Verify ANSI color log display
   - Test responsive design on multiple screen sizes
   - Validate Spanish data authenticity

2. **Performance Optimization** (2 hours)
   - Optimize bundle size (code splitting)
   - Implement virtual scrolling for long logs
   - Add debouncing to API calls
   - Cache static assets

3. **Deployment** (2 hours)
   - Deploy to Vercel or Railway static
   - Configure environment variables
   - Set up custom domain (if available)
   - Test production deployment

4. **Documentation** (1 hour)
   - Update README with setup instructions
   - Create user guide for security trainers
   - Document API integration for future extensions

**Deliverables:**
- ✅ Production deployment live
- ✅ All tests passing
- ✅ Documentation complete
- ✅ Project ready for security training use

---

## 🔧 **TECHNICAL IMPLEMENTATION DETAILS**

### **Component Structure:**
```
src/
├── components/
│   ├── Terminal/
│   │   ├── TerminalDisplay.tsx      # xterm.js wrapper
│   │   ├── TerminalInput.tsx        # Command input
│   │   ├── TerminalLogs.tsx         # Log display with ANSI
│   │   └── TerminalHeader.tsx       # Title and status
│   ├── AttackControls/
│   │   ├── PhoneInput.tsx           # +34 phone input
│   │   ├── AttackButtons.tsx        # RECON, SIM SWAP, WEB HIJACK
│   │   ├── ProgressBar.tsx          # Attack progress
│   │   └── AttackStatus.tsx         # Current attack status
│   ├── VictimDashboard/
│   │   ├── ChatViewer.tsx           # WhatsApp chat simulation
│   │   ├── ContactList.tsx          # Spanish contact cards
│   │   ├── MediaGallery.tsx         # Photo/video thumbnails
│   │   ├── LocationMap.tsx          # Static map with coordinates
│   │   └── VictimProfile.tsx        # Name, age, location, operator
│   └── Layout/
│       ├── MainLayout.tsx           # Split panel layout
│       ├── Header.tsx               # Logo and title
│       └── Footer.tsx               # Legal disclaimers
├── hooks/
│   ├── useAttackSimulation.ts       # Main attack logic
│   ├── useTerminal.ts               # xterm.js integration
│   └── usePolling.ts                # Status polling
├── services/
│   └── api.ts                       # Axios API client
├── stores/
│   └── attackStore.ts               # Zustand state management
└── utils/
    ├── ansiParser.ts                # ANSI color parsing
    └── spanishFormatter.ts          # Spanish data formatting
```

### **API Integration Points:**
```typescript
// All API calls must include error handling
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Example attack flow:
// 1. POST /attack/recon → get attackId and operator info
// 2. POST /attack/sim-swap → start SIM swap simulation
// 3. GET /attack/status/{attackId} → poll for updates
// 4. Display victim data from attack response
```

### **Spanish Data Display:**
- **Names:** "Antonio García López" (real Spanish names)
- **Locations:** "Madrid, Comunidad de Madrid" (real Spanish cities)
- **Chats:** "Hola, ¿qué tal?" (authentic Spanish phrases)
- **Time:** 24-hour format with Spanish timezone (Europe/Madrid)

---

## 🎨 **DESIGN SPECIFICATIONS**

### **Color Palette:**
```css
--terminal-bg: #0a0a0a;
--terminal-text: #00ff00;
--terminal-info: #0088ff;
--terminal-success: #55ff55;
--terminal-warning: #ffff55;
--terminal-error: #ff5555;
--panel-bg: #1a1a1a;
--border: #333333;
--accent: #00aaff;
```

### **Typography:**
- **Terminal:** 'Courier New', monospace, 14px
- **UI Text:** 'Inter', -apple-system, sans-serif
- **Headings:** 'JetBrains Mono', monospace

### **Layout:**
```
Desktop (1200px+):
┌─────────────────────────────────────────────────┐
│ [LOGO] WhatsApp Pentest Simulator v1.0.0        │
├─────────────────────────────────────────────────┤
│  ┌────────────────┬─────────────────────────┐  │
│  │                │                         │  │
│  │  TERMINAL      │   VICTIM DASHBOARD      │  │
│  │  (60%)         │   (40%)                 │  │
│  │                │                         │  │
│  │  ┌──────────┐  │  ┌──────────────────┐   │  │
│  │  │ CONTROLS │  │  │ CHAT VIEWER      │   │  │
│  │  └──────────┘  │  └──────────────────┘   │  │
│  └────────────────┴─────────────────────────┘  │
└─────────────────────────────────────────────────┘

Mobile (stacked):
┌─────────────────────────────────────────────────┐
│ [LOGO] WhatsApp Pentest Simulator v1.0.0        │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐  │
│  │            TERMINAL OUTPUT              │  │
│  └─────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────┐  │
│  │            VICTIM DASHBOARD             │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## ⚠️ **RISKS & MITIGATIONS**

### **Risk 1: API Availability**
- **Risk:** Backend API down during development
- **Mitigation:** Use mock data fallback, implement offline mode
- **Fallback:** Synthetic Spanish data generation on frontend

### **Risk 2: xterm.js Performance**
- **Risk:** Lag with thousands of log lines
- **Mitigation:** Virtual scrolling, log truncation, debounced updates
- **Fallback:** Simple textarea for very long sessions

### **Risk 3: Spanish Data Authenticity**
- **Risk:** Generated data doesn't feel authentically Spanish
- **Mitigation:** Use real Spanish names database, common phrases
- **Testing:** Have Spanish speaker review data authenticity

### **Risk 4: Legal Compliance**
- **Risk:** Tool could be misused or misunderstood
- **Mitigation:** Prominent disclaimers, educational context, rate limiting
- **Documentation:** Clear educational purpose statement

---

## ✅ **ACCEPTANCE CRITERIA**

### **Functional:**
- [ ] Spanish phone number validation (+34 format only)
- [ ] RECON button detects operator and vulnerabilities
- [ ] SIM SWAP simulation shows realistic 4-6 hour timeline
- [ ] Victim dashboard displays Spanish data (chats, contacts, media)
- [ ] Real-time logs with ANSI colors (green success, red errors)
- [ ] Mobile responsive design (stacked layout on mobile)

### **Non-functional:**
- [ ] Professional terminal aesthetic (not "educational follet")
- [ ] Loading states for all API calls
- [ ] Error handling with user-friendly messages
- [ ] Legal disclaimers visible on all screens
- [ ] Performance: < 2s response time for reconnaissance

### **Security:**
- [ ] No real attacks performed (simulation only)
- [ ] All data synthetically generated
- [ ] Rate limiting respected (429 error handling)
- [ ] Educational purpose clearly communicated

---

## 🚀 **STARTING POINT**

### **Immediate First Steps:**
1. **Clone or create repository**
2. **Install dependencies:**
   ```bash
   npm create vite@latest whatsapp-pentest-frontend -- --template react-ts
   cd whatsapp-pentest-frontend
   npm install xterm @xterm/xterm @xterm/addon-fit
   npm install axios zustand
   npm install tailwindcss postcss autoprefixer
   npm install -D @types/xterm
   ```
3. **Copy API integration from `FRONTEND_INTEGRATION.md`**
4. **Start with terminal component**
5. **Test with backend API (if available) or mock data**

### **Backend Status:**
- **URL:** `https://backend.up.railway.app/api` (once Railway fixed)
- **Health check:** `GET /health`
- **Recon test:** `POST /attack/recon` with `{"phoneNumber": "+34632983603"}`
- **Documentation:** See `API_DOCS.md`

---

## 📞 **SUPPORT & COORDINATION**

### **Backend Developer:** Hermes
- **Role:** Technical Director / Backend Lead
- **Availability:** For API issues and integration support
- **Deliverables:** Complete backend API with Spanish data

### **Frontend Developer:** Claude
- **Role:** Frontend Lead / UI/UX Developer
- **Timeline:** 3-4 days for MVP
- **Deliverables:** Professional terminal interface

### **Communication:**
- **Daily progress:** Update in project documentation
- **Blockers:** Document in `PROJECT_STATUS.md`
- **Questions:** Reference `API_DOCS.md` and `FRONTEND_INTEGRATION.md`

---

**Start Date:** Immediately  
**Target Completion:** 3-4 days  
**Priority:** High (Backend ready, awaiting frontend)**

**BEGIN FRONTEND DEVELOPMENT NOW.**