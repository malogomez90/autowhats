# WhatsApp Pentest Simulator - API Documentation

**Version:** 1.0.0  
**Base URL:** `https://backend.up.railway.app/api` (production) or `http://localhost:5000/api` (development)  
**Purpose:** Educational security simulation only

---

## 🚨 **SECURITY DISCLAIMER**

**⚠️ IMPORTANT:** This API simulates attacks for educational and demonstration purposes only.  
**✅ NO REAL ATTACKS ARE PERFORMED**  
**✅ ALL DATA IS SYNTHETICALLY GENERATED**  
**✅ FOR PROFESSIONAL SECURITY TRAINING & DEMONSTRATION**  
**✅ REAL ATTACKS WITHOUT AUTHORIZATION ARE ILLEGAL**

Every response includes security warnings and legal disclaimers.

---

## 📋 **API OVERVIEW**

### **Available Endpoints:**

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Attack Simulation** | `/attack/recon` | POST | OSINT reconnaissance and operator detection |
| **Attack Simulation** | `/attack/sim-swap` | POST | SIM swap attack simulation |
| **Attack Simulation** | `/attack/web-hijack` | POST | WhatsApp Web hijacking simulation |
| **Attack Simulation** | `/attack/status/{id}` | GET | Attack status and logs |
| **Attack Simulation** | `/attack/active` | GET | List active attacks |
| **Attack Simulation** | `/attack/capabilities` | GET | Available attack types |
| **Attack Simulation** | `/attack/health` | GET | Attack engine health |
| **Authentication** | `/auth/login` | POST | Simulated login (educational) |
| **Authentication** | `/auth/register` | POST | Simulated registration |
| **Session** | `/session/create` | POST | Create simulation session |
| **Simulation** | `/simulation/attacks` | GET | Available simulation types |
| **System** | `/health` | GET | System health check |
| **System** | `/api/docs` | GET | This documentation |

---

## 🔍 **ATTACK SIMULATION ENDPOINTS**

### **1. Reconnaissance (`POST /api/attack/recon`)**

Performs simulated OSINT gathering on a Spanish phone number.

**Request:**
```json
{
  "phoneNumber": "+34632983603"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "attackId": "attack_123456789",
    "phoneNumber": "+34632983603",
    "timestamp": "2026-04-08T14:30:00Z",
    "operator": {
      "name": "Vodafone España",
      "mcc": 214,
      "mnc": 1,
      "securityScore": 80,
      "detectionTime": "1-3 hours",
      "requiresDocumentation": false
    },
    "detection": {
      "confidence": 92,
      "method": "PATTERN_ANALYSIS",
      "reliability": "HIGH"
    },
    "victim": {
      "name": "Antonio García López",
      "age": 34,
      "location": "Madrid, Spain",
      "riskScore": 65
    },
    "vulnerabilities": [
      {
        "type": "SIM_SWAP",
        "probability": 75,
        "description": "Operator allows SIM replacement with social engineering"
      }
    ],
    "recommendedAttack": "SIM_SWAP",
    "estimatedSuccessRate": 75,
    "timeElapsed": 245
  },
  "warning": "EDUCATIONAL SIMULATION - NO REAL ATTACK PERFORMED"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Could not detect operator. Phone number may not be Spanish.",
  "legalNotice": "This is a simulation for educational purposes only."
}
```

---

### **2. SIM Swap Attack (`POST /api/attack/sim-swap`)**

Simulates a SIM swap attack with realistic timeline and outcome.

**Request:**
```json
{
  "phoneNumber": "+34632983603",
  "reconId": "attack_123456789" // Optional
}
```

**Response (Success - Attack Successful):**
```json
{
  "success": true,
  "data": {
    "attackId": "attack_987654321",
    "phoneNumber": "+34632983603",
    "timestamp": "2026-04-08T14:45:00Z",
    "type": "SIM_SWAP",
    "operator": "Vodafone España",
    "success": true,
    "probability": 75,
    "factors": [
      "Operator security score: 80",
      "Attack type modifier: +15%",
      "Detection time: 1-3 hours",
      "Requires documentation: No (easier)"
    ],
    "timeline": [
      {
        "time": "0:00",
        "action": "Reconnaissance completed",
        "status": "COMPLETED",
        "completed": true,
        "log": "[0:00] Reconnaissance completed"
      }
    ],
    "duration": "4-6 hours (simulated)",
    "logs": [
      "[2026-04-08T14:30:00Z] ✅ [0:00] Reconnaissance completed"
    ],
    "compromisedData": {
      "chats": [...],
      "contacts": [...],
      "mediaCount": 42,
      "lastSeen": "2026-04-08T14:20:00Z",
      "statusUpdates": [...]
    },
    "accessLevel": "FULL",
    "persistence": "SESSION_HIJACKED",
    "recommendedActions": [
      "Change WhatsApp password immediately",
      "Enable two-step verification",
      "Contact operator to revert SIM swap",
      "Monitor for unusual activity"
    ]
  },
  "legalWarning": "⚠️ SIMULATION ONLY - Real SIM swap attacks are illegal without authorization"
}
```

**Response (Attack Failed):**
```json
{
  "success": true,
  "data": {
    "attackId": "attack_987654321",
    "success": false,
    "failureReason": "Operator security measures detected attack",
    "countermeasures": [
      "Operator detected unusual activity",
      "Additional verification required",
      "Attack flagged for review"
    ]
  }
}
```

---

### **3. WhatsApp Web Hijacking (`POST /api/attack/web-hijack`)**

Simulates WhatsApp Web session hijacking via QR code interception.

**Request:**
```json
{
  "phoneNumber": "+34632983603"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attackId": "attack_555555555",
    "phoneNumber": "+34632983603",
    "timestamp": "2026-04-08T15:00:00Z",
    "type": "WEB_HIJACK",
    "success": true,
    "qrCodeId": "qr_123456",
    "sessionToken": "session_abcdef123456",
    "steps": [...],
    "technique": "QR_CODE_INTERCEPTION",
    "logs": [...],
    "accessDuration": "24-48 hours (estimated)",
    "detectionProbability": "LOW",
    "dataAccess": ["CHATS", "CONTACTS", "MEDIA", "STATUS_UPDATES"]
  },
  "warning": "WhatsApp Web hijacking simulated for educational purposes only",
  "protectionTips": [
    "Always log out of WhatsApp Web when not using it",
    "Never scan QR codes from untrusted sources",
    "Enable two-step verification in WhatsApp settings",
    "Regularly check active sessions in WhatsApp"
  ]
}
```

---

### **4. Attack Status (`GET /api/attack/status/{attackId}`)**

Retrieves status and logs for a specific attack.

**Response:**
```json
{
  "success": true,
  "data": {
    "attackId": "attack_123456789",
    "type": "sim_swap",
    "status": "SUCCESS",
    "startTime": "2026-04-08T14:30:00Z",
    "endTime": "2026-04-08T14:45:00Z",
    "duration": "900.00s",
    "logs": [...],
    "summary": "SIM swap attack successful"
  },
  "note": "Attack simulations expire after 24 hours for privacy and security"
}
```

---

### **5. Active Attacks (`GET /api/attack/active`)**

Lists all currently active attack simulations.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 3,
    "active": 2,
    "attacks": [
      {
        "id": "attack_123456789",
        "type": "sim_swap",
        "status": "IN_PROGRESS",
        "startTime": "2026-04-08T14:30:00Z",
        "phoneNumber": "+34632983603"
      }
    ]
  },
  "disclaimer": "Active simulations are stored in memory only and will be lost on server restart"
}
```

---

### **6. Capabilities (`GET /api/attack/capabilities`)**

Lists available attack simulations and system capabilities.

**Response:**
```json
{
  "success": true,
  "data": {
    "simulator": "WhatsApp Pentest Simulator",
    "version": "1.0.0",
    "purpose": "Educational security demonstration",
    "availableAttacks": [...],
    "dataSources": [...],
    "limitations": [...],
    "legal": {...}
  },
  "educationalNote": "This simulator helps security professionals understand attack vectors to better defend against them."
}
```

---

## 🎯 **DATA GENERATION**

### **Synthetic Spanish Data Features:**

1. **Realistic Spanish Names:** Authentic Spanish names and surnames
2. **Location Data:** Spanish cities with coordinates and regions
3. **Chat Simulation:** Realistic Spanish chat patterns with common phrases
4. **Contact Networks:** Simulated contact lists with relationship types
5. **Media Files:** Synthetic photos, videos, audio, and documents
6. **Status Updates:** Typical WhatsApp status messages in Spanish

### **Data Security:**
- All data is 100% synthetic
- No real user data is accessed or stored
- GDPR-compliant by design
- Data generated on-the-fly and not persisted

---

## 🔧 **INTEGRATION EXAMPLES**

### **JavaScript (Fetch API):**
```javascript
// Perform reconnaissance
async function performRecon(phoneNumber) {
  const response = await fetch('https://backend.up.railway.app/api/attack/recon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Attack ID:', data.data.attackId);
    console.log('Operator:', data.data.operator.name);
    return data.data;
  } else {
    console.error('Error:', data.error);
  }
}

// Check attack status
async function checkStatus(attackId) {
  const response = await fetch(`https://backend.up.railway.app/api/attack/status/${attackId}`);
  return await response.json();
}
```

### **Python (Requests):**
```python
import requests

def simulate_sim_swap(phone_number):
    url = "https://backend.up.railway.app/api/attack/sim-swap"
    payload = {"phoneNumber": phone_number}
    
    response = requests.post(url, json=payload)
    data = response.json()
    
    if data["success"]:
        print(f"Attack ID: {data['data']['attackId']}")
        print(f"Success: {data['data']['success']}")
    return data
```

### **cURL:**
```bash
# Reconnaissance
curl -X POST https://backend.up.railway.app/api/attack/recon \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+34632983603"}'

# Check status
curl https://backend.up.railway.app/api/attack/status/attack_123456789

# Get capabilities
curl https://backend.up.railway.app/api/attack/capabilities
```

---

## ⚠️ **ERROR HANDLING**

### **Common HTTP Status Codes:**

| Code | Meaning | Typical Response |
|------|---------|------------------|
| 200 | Success | `{"success": true, "data": {...}}` |
| 400 | Bad Request | `{"success": false, "error": "Invalid phone number"}` |
| 404 | Not Found | `{"success": false, "error": "Attack ID not found"}` |
| 429 | Rate Limited | `{"success": false, "error": "Too many requests"}` |
| 500 | Server Error | `{"success": false, "error": "Internal server error"}` |

### **Rate Limiting:**
- 100 requests per 15 minutes per IP address
- Exceeding limit returns HTTP 429
- Limits reset automatically

---

## 🔒 **SECURITY HEADERS**

All responses include security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
X-Security-Warning: SIMULATION-ONLY-NO-REAL-ATTACK
```

---

## 📞 **SUPPORT & CONTACT**

**For technical issues:**
- Check system health: `GET /health`
- Review capabilities: `GET /api/attack/capabilities`
- Monitor active attacks: `GET /api/attack/active`

**Legal inquiries:** security@example.com (placeholder)

**Educational use:** This API is intended for security education, training, and awareness programs.

---

## 🏁 **QUICK START**

1. **Test connection:**
   ```bash
   curl https://backend.up.railway.app/health
   ```

2. **Get capabilities:**
   ```bash
   curl https://backend.up.railway.app/api/attack/capabilities
   ```

3. **Run reconnaissance:**
   ```bash
   curl -X POST https://backend.up.railway.app/api/attack/recon \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+34632983603"}'
   ```

4. **Simulate attack:**
   ```bash
   curl -X POST https://backend.up.railway.app/api/attack/sim-swap \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+34632983603"}'
   ```

---

**Last Updated:** April 8, 2026  
**API Version:** 1.0.0  
**Status:** Ready for integration