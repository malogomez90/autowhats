# WhatsApp Security Simulator - Educational Demo

## ⚠️ IMPORTANT DISCLAIMER
**This is an educational tool only.** No real attacks are performed. This simulation demonstrates common security threats to help users understand and protect against them. Use responsibly and only for legitimate educational purposes.

## Overview
A comprehensive educational platform that simulates WhatsApp security threats to teach cybersecurity awareness. The project demonstrates common attack vectors (phishing, brute force, social engineering) in a safe, controlled environment.

## Features
- **Interactive Simulations**: Safe demonstrations of phishing, brute force, and social engineering attacks
- **Educational Content**: Security tips, statistics, and prevention strategies
- **Real-time Feedback**: Immediate educational insights after each simulation
- **Professional Dashboard**: Modern UI with security statistics and learning resources
- **Multi-container Architecture**: Docker-based deployment with PostgreSQL, Redis, monitoring
- **CI/CD Pipeline**: Automated testing, linting, and security scanning

## Technology Stack
### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router
- Axios for API calls
- Vitest + React Testing Library

### Backend
- Node.js + Express
- PostgreSQL + Redis
- JWT for authentication
- Winston logging
- Express Validator

### Infrastructure
- Docker + Docker Compose
- Nginx (production)
- PostgreSQL (database)
- Redis (caching/sessions)
- Adminer (database management)
- Prometheus + Grafana (monitoring)

### DevOps
- GitHub Actions CI/CD
- ESLint + Prettier
- Security scanning (trivy, snyk)
- Multi-stage Docker builds

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Git

### Option 1: Docker Compose (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd whatsapp-security-simulator

# Start all services
cd docker
docker-compose up --build

# Access the application:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Adminer (DB): http://localhost:8080
# Grafana: http://localhost:3001 (admin/admin)
```

### Option 2: Development Setup
```bash
# Backend setup
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend setup (in another terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Project Structure
```
whatsapp-security-simulator/
├── frontend/                 # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
├── docker/                   # Docker configuration
│   ├── docker-compose.yml
│   └── nginx/
├── database/                 # Database schemas and migrations
├── .github/workflows/        # CI/CD pipelines
├── docs/                     # Documentation
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Simulated login with educational feedback
- `POST /api/auth/register` - Simulated registration
- `POST /api/auth/logout` - Session termination simulation

### Simulations
- `GET /api/simulation/attacks` - List available simulation types
- `POST /api/simulation/phishing` - Run phishing simulation
- `POST /api/simulation/brute-force` - Run brute force simulation
- `POST /api/simulation/social-engineering` - Run social engineering simulation

### Sessions
- `POST /api/session/create` - Create simulated session
- `GET /api/session/status` - Get session status
- `GET /api/session/history` - Get session history
- `POST /api/session/terminate` - Terminate session

## Educational Content
The simulation includes:
- **Security Tips**: Practical advice for protecting accounts
- **Attack Statistics**: Real-world data on cyber threats
- **Red Flags**: How to recognize suspicious activity
- **Prevention Strategies**: Steps to avoid common attacks
- **Learning Resources**: Links to official security guides

## Safety Features
1. **No Real Attacks**: All simulations are completely fake
2. **No Data Storage**: User inputs are not persisted
3. **Educational Focus**: Every simulation includes security education
4. **Clear Warnings**: Prominent disclaimers throughout the interface
5. **Ethical Design**: Built to educate, not to facilitate attacks

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting
```bash
# Backend linting
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

### Building for Production
```bash
# Build Docker images
docker-compose -f docker/docker-compose.yml build

# Or build individually
cd backend && docker build -t backend:latest .
cd frontend && docker build -t frontend:latest .
```

## Deployment

### Docker Deployment
```bash
# Production deployment
docker-compose -f docker/docker-compose.prod.yml up -d

# With custom environment
docker-compose -f docker/docker-compose.yml --env-file .env.production up -d
```

### Cloud Deployment
The project includes Dockerfiles and can be deployed to:
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Apps
- DigitalOcean App Platform
- Any Docker-compatible platform

## Monitoring
- **Prometheus**: Metrics collection at `http://localhost:9090`
- **Grafana**: Dashboards at `http://localhost:3001`
- **Health Checks**: `GET /health` endpoint
- **Logging**: Structured JSON logs with Winston

## Security Considerations
- All code is open for review
- No real credentials are used
- Rate limiting on all endpoints
- Security headers enabled
- Input validation and sanitization
- Educational purpose clearly stated

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes with clear educational focus
4. Add/update tests
5. Submit a pull request

## License
MIT License - See LICENSE file for details

## Acknowledgments
- Built for cybersecurity education
- Inspired by real-world security threats
- Designed to promote security awareness
- Educational resources from CISA, FTC, and security organizations

## Contact
For educational purposes only. Not affiliated with WhatsApp or Meta.

---
**Remember**: Security awareness is the best defense. This tool helps build that awareness safely and ethically.