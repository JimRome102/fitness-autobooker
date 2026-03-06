# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- SMS notifications via Twilio
- Multi-user support
- Mobile app (React Native)
- Google Calendar integration
- Smart scheduling recommendations

---

## [1.0.0] - 2026-03-15 (Target)

### Added - MVP Release

#### Frontend
- Calendar-based configuration interface
- Booking preference management (add, edit, delete)
- Platform credential management with encryption
- Booking history dashboard
- Success/waitlist/failure status indicators
- Responsive design (mobile, tablet, desktop)
- User-friendly forms with validation
- Loading states and error handling

#### Backend
- RESTful API with Express.js
- Multi-platform browser automation:
  - ClassPass support
  - Mindbody support
  - Barry's Bootcamp support
  - SLT support
  - Y7 Studio support
- AES-256-GCM credential encryption
- Scheduled execution via Render Cron Jobs
- Email notifications via Resend
- Booking history tracking
- PostgreSQL database via Supabase
- Rate limiting and security middleware
- Comprehensive error handling
- Retry logic for transient failures

#### Documentation
- Comprehensive README with setup instructions
- Product Requirements Document (PRD)
- Technical architecture documentation
- API reference documentation
- UI/UX mockups and design system
- Contributing guidelines
- Security policy
- Code of conduct

#### Infrastructure
- Frontend deployment on Vercel
- Backend deployment on Render
- Database on Supabase (free tier)
- Email service via Resend (free tier)
- GitHub Actions CI/CD pipeline
- Automated testing

#### Developer Experience
- TypeScript for type safety
- ESLint + Prettier for code quality
- Jest for testing
- Docker support for local development
- Environment variable management
- Git hooks for pre-commit checks

### Security
- HTTPS-only communications
- Encrypted credential storage
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

---

## [0.2.0] - 2026-03-08 (Development)

### Added
- Initial project structure
- Basic frontend scaffolding with Next.js
- Backend API foundation with Express
- Database schema design
- Puppeteer integration for browser automation
- Basic ClassPass automation (proof of concept)

### Changed
- Migrated from JavaScript to TypeScript
- Updated database schema for better performance

### Fixed
- Browser automation timeout issues
- Supabase connection pooling

---

## [0.1.0] - 2026-03-06 (Planning)

### Added
- Project initialization
- Complete documentation suite
- PRD and technical specifications
- Design mockups and wireframes
- Development roadmap
- Git repository structure

### Documentation
- Created comprehensive README
- Defined architecture and tech stack
- Documented API endpoints
- Created UI/UX mockups
- Established contributing guidelines
- Security policy documentation

---

## Release Notes

### Version 1.0.0 - MVP (Target: March 15, 2026)

This is the initial MVP release of FitBook Auto, bringing automated fitness class booking to users who are tired of waking up at midnight!

**Key Features:**
- 🎯 Support for 5 major fitness platforms
- 📅 Intuitive calendar-based booking configuration
- 🔒 Secure credential management with AES-256 encryption
- ⏰ Automatic execution at midnight on the 21st
- 📧 Email summaries of booking results
- 📊 Complete booking history tracking
- 💰 Runs entirely on free cloud tiers

**Supported Platforms:**
1. ClassPass
2. Mindbody
3. Barry's Bootcamp
4. SLT (Strengthen Lengthen Tone)
5. Y7 Studio

**Technical Highlights:**
- Built with Next.js 14 (React 18)
- Node.js 20 backend with Puppeteer automation
- PostgreSQL database via Supabase
- Deployed on Vercel (frontend) and Render (backend)
- TypeScript throughout for type safety
- Comprehensive test coverage

**Known Limitations:**
- Single user support (multi-user in Phase 2)
- Manual 2FA handling required
- Some platforms may require CAPTCHA solving
- Free tier resource limits

**Breaking Changes:**
None (initial release)

**Migration Guide:**
N/A (initial release)

**Upgrade Instructions:**
```bash
# Clone the repository
git clone https://github.com/yourusername/fitness-autobooker.git
cd fitness-autobooker

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
# See README.md for detailed instructions

# Run locally
npm run dev
```

**Contributors:**
- Initial development by [Your Name]
- Special thanks to early testers and feedback providers

**Full Changelog:**
https://github.com/yourusername/fitness-autobooker/compare/v0.2.0...v1.0.0

---

## Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.0.0): Incompatible API changes
- **MINOR** version (0.1.0): New features, backwards-compatible
- **PATCH** version (0.0.1): Bug fixes, backwards-compatible

---

## Categories

Changes are grouped into:

- `Added` - New features
- `Changed` - Changes to existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security fixes

---

## Links

- [Compare Versions](https://github.com/yourusername/fitness-autobooker/compare)
- [Release Tags](https://github.com/yourusername/fitness-autobooker/releases)
- [Milestones](https://github.com/yourusername/fitness-autobooker/milestones)

---

[Unreleased]: https://github.com/yourusername/fitness-autobooker/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/fitness-autobooker/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/yourusername/fitness-autobooker/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/yourusername/fitness-autobooker/releases/tag/v0.1.0
