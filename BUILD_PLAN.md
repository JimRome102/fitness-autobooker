# FitBook Auto - Build Plan & Implementation Guide

## Project Status: Documentation Complete ✅

The complete project documentation, architecture, and scaffolding have been created. This document outlines the implementation phases to build the actual application.

---

## What's Been Completed

### ✅ Documentation Suite
- **README.md** - Portfolio-ready project overview
- **PRD.md** - Complete Product Requirements Document
- **ARCHITECTURE.md** - Technical architecture with diagrams
- **API.md** - RESTful API documentation
- **MOCKUPS.md** - UI/UX designs and mockups
- **CONTRIBUTING.md** - Contribution guidelines
- **SECURITY.md** - Security policy
- **CHANGELOG.md** - Version history template
- **LICENSE** - MIT License

### ✅ Project Structure
```
fitness-autobooker/
├── .github/workflows/       ✅ CI/CD pipeline configured
├── docs/                    ✅ Complete documentation
├── frontend/                ✅ Scaffolded with package.json
├── backend/                 ✅ Scaffolded with package.json
└── Root configs             ✅ Git, configs ready
```

### ✅ Configuration Files
- `package.json` (frontend & backend)
- `tsconfig.json` (frontend & backend)
- `.env.example` (frontend & backend)
- `.gitignore`
- GitHub Actions workflow

### ✅ Git Repository
- Initialized with first commit
- Ready to push to GitHub

---

## Next Steps: Actual Implementation

### Phase 1: Setup & Infrastructure (Week 1)

#### 1.1 Push to GitHub
```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/jimrome102/fitness-autobooker.git
git branch -M main
git push -u origin main
```

#### 1.2 Set Up Cloud Services

**Supabase (Database)**
1. Sign up at https://supabase.com
2. Create new project: `fitness-autobooker`
3. Run database migrations (create SQL from ARCHITECTURE.md schema)
4. Get connection details (URL + anon key)

**Render (Backend Hosting)**
1. Sign up at https://render.com
2. Create new Web Service from GitHub repo
3. Configure environment variables
4. Set up Cron Job for monthly runs

**Vercel (Frontend Hosting)**
1. Sign up at https://vercel.com
2. Import GitHub repository
3. Configure environment variables
4. Auto-deploy enabled

**Resend (Email)**
1. Sign up at https://resend.com
2. Get API key
3. Verify domain (or use test mode)

#### 1.3 Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

---

### Phase 2: Backend Implementation (Weeks 2-3)

#### 2.1 Core Setup
- [ ] `src/index.ts` - Server entry point
- [ ] `src/app.ts` - Express app configuration
- [ ] `src/config/database.ts` - Supabase client
- [ ] `src/config/encryption.ts` - Encryption utilities
- [ ] `src/utils/logger.ts` - Winston logger

#### 2.2 Database Models
- [ ] `src/models/User.ts`
- [ ] `src/models/Credential.ts`
- [ ] `src/models/BookingPreference.ts`
- [ ] `src/models/BookingHistory.ts`

#### 2.3 API Controllers
- [ ] `src/controllers/credentialController.ts`
- [ ] `src/controllers/preferenceController.ts`
- [ ] `src/controllers/bookingController.ts`

#### 2.4 Business Logic Services
- [ ] `src/services/credentialService.ts`
- [ ] `src/services/preferenceService.ts`
- [ ] `src/services/bookingService.ts`
- [ ] `src/services/emailService.ts`

#### 2.5 Middleware
- [ ] `src/middleware/errorHandler.ts`
- [ ] `src/middleware/validator.ts`
- [ ] `src/middleware/rateLimiter.ts`

#### 2.6 Automation Engine - Core
- [ ] `src/automation/core/BrowserManager.ts`
- [ ] `src/automation/core/BookingEngine.ts`
- [ ] `src/automation/core/SchedulerService.ts`

#### 2.7 Automation Engine - Platforms
- [ ] `src/automation/platforms/BasePlatform.ts` (abstract class)
- [ ] `src/automation/platforms/ClassPassAutomation.ts`
- [ ] `src/automation/platforms/MindbodyAutomation.ts`
- [ ] `src/automation/platforms/BarrysAutomation.ts`
- [ ] `src/automation/platforms/SLTAutomation.ts`
- [ ] `src/automation/platforms/Y7Automation.ts`

#### 2.8 Testing
- [ ] Unit tests for services
- [ ] Integration tests for API
- [ ] Mock tests for browser automation

**Priority for MVP**: Start with ClassPass only, then add others

---

### Phase 3: Frontend Implementation (Weeks 3-4)

#### 3.1 Setup & Configuration
- [ ] `src/app/layout.tsx` - Root layout
- [ ] `src/app/page.tsx` - Dashboard
- [ ] `src/lib/api-client.ts` - Axios client wrapper
- [ ] `src/styles/globals.css` - Tailwind config

#### 3.2 UI Components (shadcn/ui)
Install shadcn/ui components:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
```

#### 3.3 Layout Components
- [ ] `src/components/layout/Header.tsx`
- [ ] `src/components/layout/Sidebar.tsx`
- [ ] `src/components/layout/Footer.tsx`

#### 3.4 Feature Components - Credentials
- [ ] `src/components/credentials/CredentialForm.tsx`
- [ ] `src/components/credentials/PlatformCard.tsx`
- [ ] `src/app/credentials/page.tsx`

#### 3.5 Feature Components - Calendar
- [ ] `src/components/calendar/CalendarView.tsx`
- [ ] `src/components/calendar/BookingModal.tsx`
- [ ] `src/components/calendar/PreferenceList.tsx`
- [ ] `src/app/calendar/page.tsx`

#### 3.6 Feature Components - History
- [ ] `src/components/history/BookingHistoryTable.tsx`
- [ ] `src/app/history/page.tsx`

#### 3.7 Custom Hooks
- [ ] `src/hooks/useCredentials.ts`
- [ ] `src/hooks/useBookingPreferences.ts`
- [ ] `src/hooks/useBookingHistory.ts`

#### 3.8 State Management
- [ ] React Query setup
- [ ] Context providers if needed

---

### Phase 4: Integration & Testing (Week 5)

#### 4.1 End-to-End Testing
- [ ] Test credential management flow
- [ ] Test calendar configuration flow
- [ ] Test booking history display
- [ ] Test manual booking trigger

#### 4.2 Browser Automation Testing
- [ ] Test each platform automation individually
- [ ] Test error scenarios (timeout, network issues)
- [ ] Test waitlist functionality

#### 4.3 Email Testing
- [ ] Test email sending
- [ ] Test email template rendering
- [ ] Test success/failure scenarios

#### 4.4 Integration Testing
- [ ] Frontend → Backend API
- [ ] Backend → Supabase
- [ ] Backend → Email service
- [ ] Backend → Platform websites

---

### Phase 5: Deployment & Polish (Week 6)

#### 5.1 Production Deployment
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Set up Render Cron Job
- [ ] Verify all environment variables

#### 5.2 Monitoring & Logging
- [ ] Set up error tracking (Sentry optional)
- [ ] Configure log levels
- [ ] Set up health check monitoring

#### 5.3 Documentation Updates
- [ ] Update README with deployment URLs
- [ ] Add screenshots to README
- [ ] Create demo video
- [ ] Update CHANGELOG

#### 5.4 Security Audit
- [ ] Review all environment variables
- [ ] Test encryption/decryption
- [ ] Verify no sensitive data in logs
- [ ] Test rate limiting

---

## Development Workflow

### Daily Development Process

1. **Pick a task** from the phase you're on
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/task-name
   ```
3. **Implement the feature** with tests
4. **Test locally**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```
5. **Commit with conventional commits**:
   ```bash
   git add .
   git commit -m "feat(component): description"
   ```
6. **Push and create PR**:
   ```bash
   git push origin feature/task-name
   ```
7. **Merge after review**

### Testing Strategy

**Backend**:
```bash
cd backend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

**Frontend**:
```bash
cd frontend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

### Local Development

Run both frontend and backend simultaneously:

**Terminal 1** (Backend):
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2** (Frontend):
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## Key Implementation Notes

### 1. Start with One Platform
Build ClassPass automation first, then replicate the pattern for others. This allows you to:
- Test the core engine
- Refine the BasePlatform interface
- Validate the entire flow

### 2. Test Without Real Bookings
Create a "dry run" mode that goes through all steps without actually clicking "Book":
```typescript
const DRY_RUN = process.env.DRY_RUN === 'true';

if (!DRY_RUN) {
  await bookButton.click();
}
```

### 3. Handle Platform-Specific Quirks
Each platform will have unique challenges:
- ClassPass: Might have CAPTCHAs
- Mindbody: Multiple sub-domains per studio
- Barry's: Potential for aggressive bot detection

Document these as you discover them.

### 4. Error Handling is Critical
Browser automation is fragile. Implement comprehensive error handling:
- Network timeouts
- Element not found
- Login failures
- Platform outages

### 5. Logging for Debugging
Log everything during automation:
- Each step taken
- Time spent per step
- Screenshots on errors
- Full page HTML on critical failures

---

## Recommended Development Order

1. **Backend Foundation** (Days 1-3)
   - Database setup
   - Basic API endpoints
   - Authentication/credentials

2. **Browser Automation Basics** (Days 4-7)
   - BrowserManager
   - BasePlatform
   - One platform (ClassPass)

3. **Frontend Basics** (Days 8-10)
   - Dashboard
   - Credential management
   - Basic styling

4. **Calendar Configuration** (Days 11-14)
   - Calendar UI
   - Preference creation/editing
   - API integration

5. **Complete One Platform** (Days 15-17)
   - End-to-end for ClassPass
   - Test real bookings
   - Email notifications

6. **Add Remaining Platforms** (Days 18-28)
   - One platform every 2-3 days
   - Test each thoroughly

7. **Polish & Deploy** (Days 29-35)
   - UI/UX refinements
   - Production deployment
   - Documentation

---

## Success Criteria

### MVP is complete when:
- [ ] User can add credentials for all 5 platforms
- [ ] User can configure 4-8 booking preferences via calendar
- [ ] System successfully books at least 1 class on each platform
- [ ] Email summary sent after booking run
- [ ] Booking history displays all attempts
- [ ] Deployed to production on free tiers
- [ ] Documentation is complete

---

## Troubleshooting Common Issues

### Puppeteer Issues
```bash
# If Puppeteer fails to install
npm install puppeteer --no-save
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Use system Chrome
export PUPPETEER_EXECUTABLE_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
```

### Database Connection
```bash
# Test Supabase connection
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"
```

### CORS Issues
Add proper CORS configuration in Express:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Resources

### Documentation
- [Puppeteer Docs](https://pptr.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Express Docs](https://expressjs.com/)

### Community
- [GitHub Discussions](https://github.com/jimrome102/fitness-autobooker/discussions)
- [Issues](https://github.com/jimrome102/fitness-autobooker/issues)

---

## Questions Before Starting Implementation?

Ask yourself:
1. Do I have accounts on all 5 platforms to test?
2. Do I have access to all required cloud services?
3. Have I reviewed the security policy?
4. Do I understand the browser automation approach?
5. Am I ready to commit 4-6 weeks to this project?

---

**Ready to build? Start with Phase 1, Task 1.1!** 🚀

Good luck, and remember: start small, test often, commit frequently!
