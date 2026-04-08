```javascript
// /frontend/package.json
{
  "name": "whatsapp-hack-simulator-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-phone-number-input": "^3.2.24",
    "tailwindcss": "^3.3.3",
    "framer-motion": "^10.16.4",
    "axios": "^1.5.0",
    "react-router-dom": "^6.16.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

```javascript
// /backend/package.json
{
  "name": "whatsapp-hack-simulator-backend",
  "version": "1.0.0",
  "description": "Backend for WhatsApp Hack Simulator",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "firebase-admin": "^11.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

```javascript
// /backend/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
db.connect();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

```javascript
// /backend/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connect = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect,
};
```

```javascript
// /backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { generateFakeSession } = require('../utils/sessionUtils');

const login = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Check if user exists (in a real app, you'd verify the phone number)
    const { rows } = await db.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phoneNumber]
    );

    let user = rows[0];

    if (!user) {
      // Create a new user if they don't exist
      const result = await db.query(
        'INSERT INTO users (phone_number) VALUES ($1) RETURNING *',
        [phoneNumber]
      );
      user = result.rows[0];
    }

    // Generate a fake session
    const sessionData = generateFakeSession(phoneNumber);

    // Store session in database
    await db.query(
      'INSERT INTO sessions (user_id, session_data) VALUES ($1, $2)',
      [user.id, JSON.stringify(sessionData)]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phoneNumber: user.phone_number },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      sessionId: sessionData.sessionId,
      message: 'Authentication successful. Session created.'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = {
  login,
};
```

```javascript
// /backend/controllers/sessionController.js
const db = require('../config/db');
const { generateFakeSessionData } = require('../utils/sessionUtils');

const getSession = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT session_data FROM sessions WHERE id = $1',
      [req.params.sessionId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = rows[0].session_data;
    res.json(sessionData);
  } catch (err) {
    console.error('Get session error:', err);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
};

const getFakeMessages = async (req, res) => {
  try {
    const fakeMessages = generateFakeSessionData();
    res.json(fakeMessages);
  } catch (err) {
    console.error('Generate fake messages error:', err);
    res.status(500).json({ error: 'Failed to generate fake messages' });
  }
};

module.exports = {
  getSession,
  getFakeMessages,
};
```

```javascript
// /backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Authenticate user with phone number
router.post('/login', authController.login);

module.exports = router;
```

```javascript
// /backend/routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/session/:sessionId
// @desc    Get session data
router.get('/:sessionId', authMiddleware, sessionController.getSession);

// @route   GET /api/session/:sessionId/messages
// @desc    Get fake messages for session
router.get('/:sessionId/messages', authMiddleware, sessionController.getFakeMessages);

module.exports = router;
```

```javascript
// /backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

```javascript
// /backend/utils/sessionUtils.js
const { v4: uuidv4 } = require('uuid');

const generateFakeSession = (phoneNumber) => {
  return {
    sessionId: uuidv4(),
    phoneNumber,
    createdAt: new Date().toISOString(),
    status: 'active',
    messages: [
      {
        id: 1,
        content: 'Initializing remote session...',
        timestamp: new Date().toISOString(),
        type: 'system'
      },
      {
        id: 2,
        content: 'Connecting to WhatsApp servers...',
        timestamp: new Date(Date.now() + 2000).toISOString(),
        type: 'system'
      }
    ]
  };
};

const generateFakeSessionData = () => {
  const fakeContacts = [
    { name: 'Alice', phone: '+1234567890' },
    { name: 'Bob', phone: '+1987654321' },
    { name: 'Charlie', phone: '+1555666777' }
  ];

  const fakeMessages = fakeContacts.flatMap(contact => [
    {
      id: uuidv4(),
      from: contact.phone,
      to: '+1112223333', // Current user
      content: `Hey, this is a fake message from ${contact.name}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type: 'text'
    },
    {
      id: uuidv4(),
      from: '+1112223333', // Current user
      to: contact.phone,
      content: `Hi ${contact.name}, this is a simulated response`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type: 'text'
    }
  ]);

  return fakeMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

module.exports = {
  generateFakeSession,
  generateFakeSessionData,
};
```

```javascript
// /frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import SessionPage from './pages/SessionPage';
import EducationPage from './pages/EducationPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/session/:sessionId" element={<SessionPage />} />
            <Route path="/education" element={<EducationPage />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
```

```javascript
// /frontend/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-green-400">
              WhatsHack Simulator
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/education" className="text-gray-300 hover:text-white">
              Learn About Security
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

```javascript
// /frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        phoneNumber,
      });

      // Navigate to session page with the session ID
      navigate(`/session/${response.data.sessionId}`);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to create session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-green-400">
          WhatsApp Hack Simulator
        </h1>

        <p className="text-gray-300 mb-6 text-center">
          This is an educational tool to demonstrate how hacking attempts might work.
          No real hacking occurs. All data is simulated.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your phone number
            </label>
            <PhoneInput
              id="phone"
              international
              defaultCountry="US"
              value={phoneNumber}
              onChange={setPhoneNumber}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Session...
              </span>
            ) : (
              'Create Remote Session'
            )}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-400 text-center">
          <p>This is a simulation for educational purposes only.</p>
          <p>No actual hacking or unauthorized access occurs.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
```

```javascript
// /frontend/src/pages/SessionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const SessionPage = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // In a real app, you would get the token from auth context
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/session/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSessionData(response.data);

        // Fetch fake messages
        const messagesResponse = await axios.get(`http://localhost:5000/api/session/${sessionId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessages(messagesResponse.data);
      } catch (err) {
        console.error('Session error:', err);
        setError('Failed to load session data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-900 p-4 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-green-400">Remote Session Active</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Session Information</h2>
          <div className="bg-gray-700 p-4 rounded-md">
            <p><span className="font-medium">Session ID:</span> {sessionData.sessionId}</p>
            <p><span className="font-medium">Target Number:</span> {sessionData.phoneNumber}</p>
            <p><span className="font-medium">Status:</span> <span className="text-green-400">{sessionData.status}</span></p>
            <p><span className="font-medium">Created:</span> {new Date(sessionData.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Session Log</h2>
          <div className="bg-gray-700 p-4 rounded-md max-h-64 overflow-y-auto">
            {sessionData.messages.map((message) => (
              <div key={message.id} className="mb-2">
                <span className="text-gray-400 text-sm">
                  [{new Date(message.timestamp).toLocaleTimeString()}]
                </span>
                <span className={`ml-2 ${message.type === 'system' ? 'text-blue-400' : 'text-white'}`}>
                  {message.content}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Simulated Messages</h2>
          <div className="bg-gray-700 p-4 rounded-md max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400">No messages found in this simulated session.</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`mb-4 p-3 rounded-md ${message.from === '+1112223333' ? 'bg-blue-900/30 ml-auto' : 'bg-gray-600/30 mr-auto'} max-w-xs`}>
                  <div className="text-xs text-gray-400 mb-1">
                    {message.from === '+1112223333' ? 'You' : message.from} • {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-white">{message.content}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-900 rounded-md">
          <h3 className="font-semibold mb-2 text-yellow-400">Important Notice</h3>
          <p className="text-sm text-gray-300">
            This is a simulation. No actual messages are being intercepted or sent.
            All data shown here is completely fake and generated for educational purposes.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionPage;
```

```javascript
// /frontend/src/pages/EducationPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const EducationPage = () => {
  const securityTips = [
    {
      title: "Enable Two-Factor Authentication",
      description: "Always enable 2FA on your WhatsApp account. This adds an extra layer of security by requiring a PIN when registering your phone number with WhatsApp again."
    },
    {
      title: "Be Wary of Phishing Attempts",
      description: "Never share your verification code with anyone. WhatsApp will never call or message you asking for your verification code."
    },
    {
      title: "Keep Your App Updated",
      description: "Regularly update WhatsApp to the latest version to ensure you have the latest security patches."
    },
    {
      title: "Use Official Sources",
      description: "Only download WhatsApp from official app stores (Google Play Store or Apple App Store) to avoid malicious fake apps."
    },
    {
      title: "Check for Encryption",
      description: "Verify that your chats are end-to-end encrypted. You can check this in the contact info screen - look for the 'Messages and calls are end-to-end encrypted' notice."
    },
    {
      title: "Log Out from Web Sessions",
      description: "Regularly check and log out from active WhatsApp Web sessions that you no longer use."
    }
  ];

  const attackMethods = [
    {
      title: "SIM Swapping",
      description: "Attackers trick your mobile carrier into transferring your phone number to a SIM card they control, allowing them to receive your verification codes."
    },
    {
      title: "Phishing",
      description: "Fake websites or messages that trick you into entering your verification code or other sensitive information."
    },
    {
      title: "Malware",
      description: "Malicious software that can steal your WhatsApp data or session tokens from your device."
    },
    {
      title: "Social Engineering",
      description: "Manipulating people into breaking normal security procedures, often by pretending to be someone they're not."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-green-400">WhatsApp Security Education</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">How This Simulator Works</h2>
          <p className="text-gray-300 mb-4">
            This tool demonstrates how a hacking attempt might appear to work, but in reality:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>No actual WhatsApp accounts are accessed</li>
            <li>All "hacked" messages are completely fabricated</li>
            <li>No real data is collected or stored beyond what's needed for the simulation</li>
            <li>The session is entirely client-side with simulated server responses</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Common Attack Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attackMethods.map((method, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-700 p-4 rounded-md"
              >
                <h3 className="font-semibold text-green-400 mb-2">{method.title}</h3>
                <p className="text-gray-300 text-sm">{method.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">How to Protect Yourself</h2>
          <div className="space-y-4">
            {securityTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700 p-4 rounded-md"
              >
                <h3 className="font-semibold text-green-400 mb-2">{tip.title}</h3>
                <p className="text-gray-300 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-900 p-4 rounded-md">
          <h3 className="font-semibold mb-2 text-blue-400">Remember</h3>
          <p className="text-sm text-gray-300">
            This simulator is for educational purposes only. Unauthorized access to someone's WhatsApp
            or any other account is illegal and unethical. Always respect others' privacy and follow
            the law.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EducationPage;
```

```css
/* /frontend/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #111827;
}

.react-phone-number-input {
  width: 100%;
}

.react-phone-number-input__input {
  width: 100%;
  background-color: #374151;
  border: 1px solid #4b5563;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
}

.react-phone-number-input__input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}

@layer components {
  .btn-primary {
    @apply bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors;
  }
}
```

```sql
-- /database/schema.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
```

```markdown
# /docs/README.md
# WhatsApp Hack Simulator

This is an educational tool that simulates how a WhatsApp hacking attempt might appear to work. It's designed to raise awareness about cybersecurity and common attack vectors.

## Important Notice

⚠️ **This is a simulation only.** No actual hacking occurs. All data is fabricated and no real WhatsApp accounts are accessed or compromised.

## Features

- Simulated phone number authentication
- Fake "remote session" creation
- Simulated message interception (all messages are fabricated)
- Educational content about WhatsApp security
- Information about common attack methods and how to protect yourself

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion (for animations)
- React Phone Number Input

### Backend
- Node.js with Express
- PostgreSQL database
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/whatsapp-hack-simulator.git
   cd whatsapp-hack-simulator
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Set up the database:
   ```bash
   createdb whatsapp_simulator
   psql -U yourusername -d whatsapp_simulator -f ../database/schema.sql
   ```

4. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

5. Start the development servers:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm start`

## Educational Purpose

This tool is designed to:
- Demonstrate how hacking attempts might appear to work
- Educate users about common security threats
- Teach best practices for protecting WhatsApp accounts
- Raise awareness about cybersecurity in general

## Legal Notice

This software is for educational purposes only. The developers are not responsible for any misuse of this tool. Unauthorized access to computer systems or accounts is illegal in most jurisdictions.
```

```text
# /docs/LICENSE
MIT License

Copyright (c) 2023 WhatsApp Hack Simulator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```