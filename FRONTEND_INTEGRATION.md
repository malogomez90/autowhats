# WhatsApp Pentest Simulator - Frontend Integration Guide

**For:** Claude (Frontend Developer)  
**Status:** Backend ready for integration  
**API Version:** 1.0.0

---

## 🎯 **OVERVIEW**

The WhatsApp Pentest Simulator backend is complete and ready for frontend integration. This guide provides everything needed to build a professional terminal-style interface for the attack simulation platform.

**Key Features Implemented:**
- ✅ Spanish operator detection (Vodafone, Movistar, Orange, etc.)
- ✅ SIM swap attack simulation with realistic timelines
- ✅ WhatsApp Web hijacking simulation
- ✅ Synthetic Spanish victim data generation
- ✅ Comprehensive API with security headers
- ✅ Rate limiting and error handling

---

## 🔗 **API ENDPOINTS SUMMARY**

### **Base URLs:**
- **Development:** `http://localhost:5000/api`
- **Production:** `https://backend.up.railway.app/api`

### **Core Attack Endpoints:**

| Endpoint | Method | Purpose | Example |
|----------|--------|---------|---------|
| `/attack/recon` | POST | OSINT reconnaissance | `{"phoneNumber": "+34632983603"}` |
| `/attack/sim-swap` | POST | SIM swap simulation | `{"phoneNumber": "+34632983603"}` |
| `/attack/web-hijack` | POST | Web hijacking simulation | `{"phoneNumber": "+34632983603"}` |
| `/attack/status/{id}` | GET | Attack status/logs | `GET /attack/status/attack_123456` |
| `/attack/active` | GET | Active attacks list | `GET /attack/active` |
| `/attack/capabilities` | GET | System capabilities | `GET /attack/capabilities` |

---

## 🎨 **FRONTEND REQUIREMENTS**

### **Design Principles:**
1. **Professional Terminal Aesthetic** - Not "educational follet"
2. **Dark Theme** - `#0a0a0a` background, `#00ff00` terminal text
3. **Real-time Log Display** - ANSI color support for attack logs
4. **Spanish Data Presentation** - Authentic Spanish names, locations, chats
5. **Legal Disclaimers** - Prominent warnings on every screen

### **Recommended Tech Stack:**
- **React + TypeScript** with Vite
- **xterm.js** for terminal emulation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Zustand** for state management

---

## 🚀 **QUICK INTEGRATION EXAMPLE**

### **1. API Client Setup:**
```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const attackAPI = {
  recon: (phoneNumber: string) => 
    axios.post(`${API_BASE}/attack/recon`, { phoneNumber }),
  
  simSwap: (phoneNumber: string, reconId?: string) =>
    axios.post(`${API_BASE}/attack/sim-swap`, { phoneNumber, reconId }),
  
  webHijack: (phoneNumber: string) =>
    axios.post(`${API_BASE}/attack/web-hijack`, { phoneNumber }),
  
  getStatus: (attackId: string) =>
    axios.get(`${API_BASE}/attack/status/${attackId}`),
  
  getActive: () => axios.get(`${API_BASE}/attack/active`),
  
  getCapabilities: () => axios.get(`${API_BASE}/attack/capabilities`)
};
```

### **2. Terminal Log Component:**
```tsx
// src/components/TerminalLogs.tsx
import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalLogsProps {
  logs: string[];
  autoScroll?: boolean;
}

export default function TerminalLogs({ logs, autoScroll = true }: TerminalLogsProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#0a0a0a',
        foreground: '#00ff00',
        cursor: '#00ff00'
      },
      fontSize: 14,
      fontFamily: 'Courier New, monospace',
      convertEol: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    terminalInstance.current = term;

    return () => {
      term.dispose();
    };
  }, []);

  useEffect(() => {
    if (!terminalInstance.current || !logs.length) return;

    const term = terminalInstance.current;
    const lastLog = logs[logs.length - 1];
    
    // Parse ANSI colors if present
    term.writeln(lastLog);

    if (autoScroll) {
      term.scrollToBottom();
    }
  }, [logs, autoScroll]);

  return <div ref={terminalRef} className="w-full h-full" />;
}
```

### **3. Attack Simulation Hook:**
```typescript
// src/hooks/useAttackSimulation.ts
import { useState, useCallback } from 'react';
import { attackAPI } from '../services/api';

interface AttackLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export function useAttackSimulation() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [attackId, setAttackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<AttackLog[]>([]);
  const [victimData, setVictimData] = useState<any>(null);

  const addLog = useCallback((message: string, type: AttackLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      message,
      type
    }]);
  }, []);

  const performRecon = useCallback(async (phone: string) => {
    setIsLoading(true);
    addLog(`Starting reconnaissance for ${phone}...`, 'info');

    try {
      const response = await attackAPI.recon(phone);
      const { data } = response.data;
      
      setAttackId(data.attackId);
      addLog(`Operator detected: ${data.operator.name}`, 'success');
      addLog(`Vulnerabilities found: ${data.vulnerabilities.length}`, 'info');
      
      return data;
    } catch (error: any) {
      addLog(`Reconnaissance failed: ${error.response?.data?.error || error.message}`, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addLog]);

  const performSimSwap = useCallback(async (phone: string) => {
    setIsLoading(true);
    addLog(`Initiating SIM swap attack for ${phone}...`, 'warning');

    try {
      const response = await attackAPI.simSwap(phone, attackId || undefined);
      const { data } = response.data;
      
      setAttackId(data.attackId);
      
      // Add timeline logs
      data.timeline?.forEach((step: any) => {
        if (step.completed) {
          addLog(`[${step.time}] ${step.action}`, 'info');
        }
      });

      if (data.success) {
        addLog('SIM swap attack SUCCESSFUL', 'success');
        setVictimData(data.compromisedData);
      } else {
        addLog(`Attack failed: ${data.failureReason}`, 'error');
      }

      return data;
    } catch (error: any) {
      addLog(`SIM swap failed: ${error.response?.data?.error || error.message}`, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [attackId, addLog]);

  return {
    phoneNumber,
    setPhoneNumber,
    attackId,
    isLoading,
    logs,
    victimData,
    performRecon,
    performSimSwap,
    addLog
  };
}
```

---

## 📱 **UI COMPONENT STRUCTURE**

```
src/
├── components/
│   ├── Terminal/
│   │   ├── TerminalOutput.tsx      # xterm.js wrapper
│   │   ├── TerminalInput.tsx       # Command input
│   │   └── TerminalLogs.tsx        # Log display
│   ├── AttackControls/
│   │   ├── PhoneInput.tsx          # Phone number input
│   │   ├── AttackButton.tsx        # Start attack button
│   │   └── ProgressIndicator.tsx   # Attack progress
│   ├── VictimDashboard/
│   │   ├── ChatViewer.tsx          # Chat conversation
│   │   ├── ContactList.tsx         # Contact cards
│   │   ├── MediaGallery.tsx        # Image/video gallery
│   │   └── LocationMap.tsx         # Static map display
│   └── Layout/
│       ├── MainLayout.tsx          # Split panel layout
│       └── Header.tsx              # Logo and title
├── hooks/
│   ├── useAttackSimulation.ts      # Main attack logic
│   └── useTerminal.ts              # xterm.js integration
└── services/
    └── api.ts                      # Axios API client
```

---

## 🎨 **DESIGN SPECIFICATIONS**

### **Color Palette:**
```css
--bg-primary: #0a0a0a;
--terminal-text: #00ff00;
--terminal-info: #0088ff;
--terminal-success: #55ff55;
--terminal-warning: #ffff55;
--terminal-error: #ff5555;
--panel-bg: #1a1a1a;
--border: #333333;
```

### **Terminal Log Format:**
```
[14:30:45] [RECON] Starting reconnaissance for +34632983603
[14:30:48] [RECON] Carrier identified: Vodafone España
[14:30:52] [RECON] Vulnerabilities: SIM_SWAP, SS7_EXPLOIT
[14:31:05] [SOCIAL_ENG] Initiating social engineering attack...
[14:32:20] [SIM_TRANSFER] SIM transfer initiated
[14:34:35] [SUCCESS] New SIM activated
[14:35:50] [DATA_EXTR] Extracting WhatsApp data...
```

### **Layout:**
```
┌─────────────────────────────────────────────────┐
│ [LOGO] WhatsApp Pentest Simulator v1.0.0        │
├─────────────────────────────────────────────────┤
│  ┌────────────────┬─────────────────────────┐  │
│  │                │                         │  │
│  │  TERMINAL      │   VICTIM DATA           │  │
│  │  OUTPUT        │   PREVIEW               │  │
│  │  (60%)         │   (40%)                 │  │
│  │                │                         │  │
│  │  ┌──────────┐  │                         │  │
│  │  │ CONTROLS │  │                         │  │
│  │  ┌──────────┘  │                         │  │
│  └────────────────┴─────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🔧 **DEPENDENCIES TO INSTALL**

```bash
# Core
npm install react react-dom typescript
npm install vite @vitejs/plugin-react

# Terminal
npm install xterm @xterm/xterm
npm install @xterm/addon-fit @xterm/addon-web-links

# UI Components
npm install @radix-ui/react-tabs @radix-ui/react-dialog

# State Management
npm install zustand

# API Client
npm install axios

# Styling
npm install tailwindcss postcss autoprefixer
npm install clsx tailwind-merge

# Icons
npm install lucide-react
```

---

## 📊 **DATA FLOW**

### **Typical User Journey:**
1. **User enters Spanish phone number** (+34 format)
2. **Frontend calls `/attack/recon`** → displays operator/vulnerabilities
3. **User initiates SIM swap attack** → calls `/attack/sim-swap`
4. **Frontend polls `/attack/status/{id}`** for real-time updates
5. **Attack completes** → victim data displayed in dashboard
6. **User can explore** chats, contacts, media, location

### **Polling Strategy:**
```typescript
// Poll attack status every 2 seconds
useEffect(() => {
  if (!attackId || !isLoading) return;

  const interval = setInterval(async () => {
    const response = await attackAPI.getStatus(attackId);
    const { data } = response.data;
    
    // Update logs
    data.logs?.forEach((log: string) => addLog(log, 'info'));
    
    // Check if attack completed
    if (data.status === 'SUCCESS' || data.status === 'FAILED') {
      clearInterval(interval);
      setIsLoading(false);
    }
  }, 2000);

  return () => clearInterval(interval);
}, [attackId, isLoading, addLog]);
```

---

## ⚠️ **LEGAL & COMPLIANCE**

### **Frontend Requirements:**
1. **Prominent Disclaimer** on every page/screen
2. **Clear Educational Purpose** statement
3. **No Misleading UI** that suggests real attacks
4. **Spanish Language Support** for victim data display
5. **GDPR Compliance** notices for synthetic data

### **Required UI Elements:**
```tsx
<LegalDisclaimer>
  <WarningIcon />
  <p>
    <strong>⚠️ EDUCATIONAL SIMULATION ONLY</strong><br />
    This tool demonstrates attack techniques for security awareness training.<br />
    No real attacks are performed. All data is synthetically generated.<br />
    Unauthorized access to systems is illegal.
  </p>
</LegalDisclaimer>
```

---

## 🚀 **NEXT STEPS FOR FRONTEND**

### **Phase 1 (Day 1): Terminal Foundation**
- [ ] Setup React + TypeScript + Vite project
- [ ] Install and configure xterm.js
- [ ] Implement dark terminal theme
- [ ] Create basic layout with split panels

### **Phase 2 (Day 2): API Integration**
- [ ] Create API client service
- [ ] Implement phone number input with validation
- [ ] Connect to reconnaissance endpoint
- [ ] Display real-time attack logs

### **Phase 3 (Day 3): Victim Dashboard**
- [ ] Build chat viewer component
- [ ] Create contact list with Spanish names
- [ ] Implement media gallery
- [ ] Add location display

### **Phase 4 (Day 4): Polish & Deployment**
- [ ] Add loading states and animations
- [ ] Implement responsive design
- [ ] Add keyboard shortcuts
- [ ] Deploy to Railway/Vercel

---

## 📞 **COORDINATION WITH BACKEND**

### **Backend Developer:** Hermes
### **Backend Status:** ✅ Complete and deployed
### **API Documentation:** See API_DOCS.md
### **Test Endpoint:** `GET /health`

### **Integration Tips:**
1. **Handle rate limiting** (429 responses) gracefully
2. **Display API errors** in terminal format
3. **Include security warnings** in all responses
4. **Use synthetic data** for demos/screenshots

---

## 🔍 **TESTING CHECKLIST**

- [ ] Spanish phone number validation (+34 format)
- [ ] Terminal log display with ANSI colors
- [ ] Real-time attack status polling
- [ ] Victim data presentation (Spanish names)
- [ ] Error handling for API failures
- [ ] Mobile responsive design
- [ ] Legal disclaimers visible

---

**Backend Ready:** Yes  
**API Stable:** Yes  
**Documentation:** Complete  
**Support:** Available via project documentation

**Start Frontend Development Immediately.**