# FitBook Auto 🏋️

> Never miss your favorite fitness class again. Automated booking for boutique fitness studios that open registration at midnight.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**FitBook Auto** is an intelligent automation system designed to solve the midnight fitness class booking problem. When boutique studios release their class schedules at midnight on the 21st of each month, this system automatically books your preferred classes while you sleep.

This project demonstrates full-stack development skills including:
- Browser automation and web scraping
- Scheduled task execution
- Secure credential management
- Modern React development
- RESTful API design
- DevOps and cloud deployment

---

## The Problem

Boutique fitness studios (Barry's, SLT, Y7, etc.) and platforms (ClassPass, Mindbody) release their monthly class schedules at midnight on the 21st of each month. Popular classes fill up within hours, forcing fitness enthusiasts to:

- ⏰ Set alarms for midnight
- 😴 Sacrifice sleep
- 📱 Frantically refresh multiple websites
- 😞 Still miss out on preferred classes

**This is unsustainable.**

---

## The Solution

FitBook Auto is a cloud-based automation system that:

1. **Runs automatically** at 12:01 AM on the 21st of each month
2. **Books your preferred classes** across multiple platforms simultaneously
3. **Joins waitlists** when classes are full
4. **Sends you a summary email** with all booking results
5. **Costs $0** to run using free cloud tiers

All while you sleep soundly.

---

## Features

### ✅ Current Features (Planned)

- **Multi-Platform Support**
  - ClassPass
  - Mindbody
  - Barry's Bootcamp
  - SLT (Strengthen Lengthen Tone)
  - Y7 Studio

- **Intelligent Calendar Interface**
  - Visual calendar for configuring class preferences
  - Priority-based booking (High/Medium/Low)
  - Support for 4-8 classes per month

- **Automated Booking Engine**
  - Browser automation using Puppeteer
  - Concurrent booking across platforms
  - Automatic waitlist joining
  - Retry logic for transient failures

- **Secure Credential Management**
  - AES-256 encryption for stored credentials
  - Encrypted at rest in Supabase
  - No plain-text storage

- **Email Notifications**
  - Detailed summary of booking results
  - Success/waitlist/failure breakdown
  - Next steps and recommendations

- **Booking History**
  - Track all past booking attempts
  - Success rate analytics
  - Debug logs for troubleshooting

### 🚀 Future Enhancements

- SMS notifications via Twilio
- Mobile app (React Native)
- Smart scheduling recommendations
- Google Calendar integration
- Multi-user support
- Payment automation

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User (Browser)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               Frontend - Next.js + React                        │
│   Calendar Config | Credential Management | Booking History     │
│                  (Deployed on Vercel Free)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend API - Node.js + Express                    │
│      Config API | Auth API | Booking Engine API                │
│                  (Deployed on Render Free)                      │
└────────────┬───────────┬────────────────┬───────────────────────┘
             │           │                │
             ▼           ▼                ▼
      ┌──────────┐ ┌──────────┐    ┌──────────────┐
      │ Supabase │ │  Render  │    │  Puppeteer   │
      │   (DB)   │ │   Cron   │    │  Automation  │
      │          │ │          │    │              │
      │ User     │ │ Triggers │    │ ClassPass    │
      │ Prefs    │ │ 12:01 AM │    │ Mindbody     │
      │ Creds    │ │ on 21st  │    │ Barry's      │
      │ History  │ │          │    │ SLT          │
      └──────────┘ └──────────┘    │ Y7           │
                                   └──────┬───────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │    Resend    │
                                   │ Email Service│
                                   └──────────────┘
```

See [ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) for detailed technical documentation.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **UI Library**: Tailwind CSS + shadcn/ui
- **Calendar**: FullCalendar
- **State Management**: React Context / Zustand
- **Deployment**: Vercel (Free Tier)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Browser Automation**: Puppeteer + puppeteer-extra-plugin-stealth
- **Scheduler**: Render Cron Jobs
- **Deployment**: Render (Free Tier)

### Database & Services
- **Database**: Supabase (PostgreSQL, Free Tier: 500MB)
- **Email**: Resend (Free Tier: 100 emails/day)
- **Encryption**: Node.js crypto (AES-256-GCM)

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Monitoring**: Render Logs + Supabase Dashboard

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Git
- Accounts on:
  - [Supabase](https://supabase.com/) (free)
  - [Render](https://render.com/) (free)
  - [Vercel](https://vercel.com/) (free)
  - [Resend](https://resend.com/) (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fitness-autobooker.git
cd fitness-autobooker

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run frontend locally
cd ../frontend
npm run dev

# Run backend locally (separate terminal)
cd ../backend
npm run dev
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend `.env`**:
```env
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Encryption
ENCRYPTION_KEY=your_256_bit_encryption_key

# Email
RESEND_API_KEY=your_resend_api_key

# App
NODE_ENV=development
PORT=3001
```

**Frontend `.env`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[Product Requirements Document (PRD)](docs/PRD.md)** - Complete product specification
- **[Architecture Documentation](docs/architecture/ARCHITECTURE.md)** - Technical architecture details
- **[API Documentation](docs/api/API.md)** - RESTful API reference
- **[UI/UX Mockups](docs/design/MOCKUPS.md)** - Interface designs and user flows
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to this project
- **[Security Policy](SECURITY.md)** - Security considerations and reporting

---

## Project Structure

```
fitness-autobooker/
├── .github/
│   ├── workflows/           # GitHub Actions CI/CD
│   └── ISSUE_TEMPLATE/      # Issue templates
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route controllers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── automation/      # Booking automation
│   │   │   ├── core/        # Core automation engine
│   │   │   └── platforms/   # Platform-specific scripts
│   │   └── utils/           # Utilities
│   ├── tests/               # Backend tests
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── styles/          # CSS/Tailwind
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Frontend utilities
│   ├── public/              # Static assets
│   ├── package.json
│   └── .env.example
├── docs/
│   ├── PRD.md               # Product Requirements Document
│   ├── architecture/        # Architecture documentation
│   ├── api/                 # API documentation
│   └── design/              # UI/UX designs and mockups
├── scripts/                 # Utility scripts
├── README.md                # This file
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
├── SECURITY.md              # Security policy
├── CHANGELOG.md             # Version history
└── .gitignore               # Git ignore rules
```

---

## Development Roadmap

### Phase 1: MVP (Weeks 1-2)
- [x] Project setup and documentation
- [ ] Single platform support (ClassPass)
- [ ] Basic calendar configuration UI
- [ ] Manual booking trigger (no scheduling)
- [ ] Email summary

### Phase 2: Multi-Platform (Weeks 3-4)
- [ ] Add Mindbody support
- [ ] Add Barry's support
- [ ] Add SLT support
- [ ] Add Y7 support
- [ ] Automated scheduling (Render Cron)
- [ ] Error handling and retry logic

### Phase 3: Polish & Deploy (Weeks 5-6)
- [ ] UI/UX improvements
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Production deployment
- [ ] User documentation

### Phase 4: Enhancements (Future)
- [ ] SMS notifications
- [ ] Mobile app
- [ ] Multi-user support
- [ ] Analytics dashboard

---

## Contributing

Contributions are welcome! This project is designed to be a learning resource and portfolio piece.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on:
- Code of conduct
- Development process
- How to submit pull requests
- Coding standards

---

## Known Limitations

- **2FA**: Platforms with two-factor authentication require manual handling
- **CAPTCHAs**: May require manual intervention if detected
- **Rate Limiting**: Free tier services have usage limits
- **Platform Changes**: UI changes by platforms require script updates
- **Single User**: MVP supports single user only

---

## FAQ

**Q: Is this against the terms of service of these platforms?**
A: This tool automates actions you would normally perform manually. However, always review platform terms of service. This is for personal use only.

**Q: What if a platform adds CAPTCHA?**
A: The system will alert you for manual intervention. Future versions may integrate CAPTCHA solving services.

**Q: Can I use this for multiple people?**
A: The MVP is single-user. Multi-user support is planned for Phase 4.

**Q: How secure are my credentials?**
A: All credentials are encrypted using AES-256 encryption and stored securely in Supabase. See [SECURITY.md](SECURITY.md) for details.

**Q: What happens if the booking fails?**
A: You'll receive an email notification with the failure reason. The system logs all attempts for debugging.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by the frustration of midnight fitness class bookings
- Built with modern open-source technologies
- Special thanks to the fitness community for feedback

---

## Contact

**Project Maintainer**: Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

**Project Link**: [https://github.com/yourusername/fitness-autobooker](https://github.com/yourusername/fitness-autobooker)

---

<div align="center">

**Made with ☕ and 💪 by someone tired of waking up at midnight**

[Report Bug](https://github.com/yourusername/fitness-autobooker/issues) · [Request Feature](https://github.com/yourusername/fitness-autobooker/issues)

</div>
