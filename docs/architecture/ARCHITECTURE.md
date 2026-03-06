# FitBook Auto - Technical Architecture

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Component Architecture](#component-architecture)
4. [Data Architecture](#data-architecture)
5. [Security Architecture](#security-architecture)
6. [Deployment Architecture](#deployment-architecture)
7. [Automation Engine](#automation-engine)
8. [API Design](#api-design)
9. [Error Handling Strategy](#error-handling-strategy)
10. [Performance Considerations](#performance-considerations)
11. [Scalability](#scalability)

---

## 1. System Overview

FitBook Auto is a distributed system consisting of three main layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│                   (Next.js Frontend on Vercel)                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS / REST API
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│                  (Express.js API on Render)                     │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   API        │  │  Business    │  │   Automation         │ │
│  │   Layer      │  │  Logic       │  │   Engine             │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ PostgreSQL Protocol
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                       DATA LAYER                                │
│                    (Supabase PostgreSQL)                        │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Serverless Frontend** | Vercel provides free hosting, automatic scaling, and CDN |
| **Container-based Backend** | Render free tier supports long-running processes (Puppeteer) |
| **PostgreSQL Database** | Supabase offers free PostgreSQL with built-in auth and REST API |
| **Browser Automation** | Platforms lack public APIs; Puppeteer provides reliable automation |
| **Scheduled Execution** | Render Cron Jobs run on schedule without dedicated server |

---

## 2. Architecture Principles

### 2.1 Design Principles

1. **Separation of Concerns**
   - Frontend handles presentation only
   - Backend handles business logic and automation
   - Database handles data persistence

2. **Stateless API**
   - All API endpoints are stateless
   - State stored in database
   - Enables horizontal scaling

3. **Fail-Safe Design**
   - Graceful degradation on platform failures
   - Comprehensive error logging
   - User notification on critical failures

4. **Security First**
   - All credentials encrypted at rest
   - HTTPS everywhere
   - No sensitive data in logs

5. **Cost-Conscious**
   - Optimize for free tier limits
   - Efficient resource usage
   - Minimal data transfer

### 2.2 Technology Selection Criteria

- **Free Tier Availability**: Must have sustainable free tier
- **Developer Experience**: Well-documented, active community
- **Reliability**: Proven track record in production
- **Security**: Built-in security features
- **Scalability**: Can scale if needed in future

---

## 3. Component Architecture

### 3.1 Frontend Architecture

```
frontend/
├── src/
│   ├── pages/                    # Next.js pages (App Router)
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx      # Calendar configuration
│   │   │   ├── credentials/
│   │   │   │   └── page.tsx      # Credential management
│   │   │   └── history/
│   │   │       └── page.tsx      # Booking history
│   │   └── api/                  # API routes (if needed)
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── calendar/
│   │   │   ├── CalendarView.tsx
│   │   │   ├── BookingModal.tsx
│   │   │   └── PreferenceList.tsx
│   │   ├── credentials/
│   │   │   ├── CredentialForm.tsx
│   │   │   └── PlatformCard.tsx
│   │   ├── history/
│   │   │   └── BookingHistoryTable.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── hooks/
│   │   ├── useBookingPreferences.ts
│   │   ├── useCredentials.ts
│   │   └── useBookingHistory.ts
│   ├── lib/
│   │   ├── api-client.ts         # API client wrapper
│   │   └── utils.ts              # Utility functions
│   └── styles/
│       └── globals.css
```

#### Key Frontend Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Component Library**: shadcn/ui (Radix UI + Tailwind)
- **Calendar**: FullCalendar
- **State Management**: React Context API + React Query for server state
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

#### Frontend Data Flow

```
User Interaction
      │
      ▼
Component (React)
      │
      ▼
Custom Hook (useBookingPreferences)
      │
      ▼
React Query (caching layer)
      │
      ▼
API Client (axios)
      │
      ▼
Backend API
```

### 3.2 Backend Architecture

```
backend/
├── src/
│   ├── index.ts                  # Entry point
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # HTTP server
│   ├── config/
│   │   ├── database.ts           # Supabase client
│   │   ├── encryption.ts         # Encryption utilities
│   │   └── email.ts              # Resend client
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── preferenceController.ts
│   │   ├── credentialController.ts
│   │   └── bookingController.ts
│   ├── services/
│   │   ├── preferenceService.ts
│   │   ├── credentialService.ts
│   │   ├── bookingService.ts
│   │   └── emailService.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Credential.ts
│   │   ├── BookingPreference.ts
│   │   └── BookingHistory.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── validator.ts
│   │   └── rateLimiter.ts
│   ├── automation/
│   │   ├── core/
│   │   │   ├── BookingEngine.ts       # Main orchestrator
│   │   │   ├── BrowserManager.ts      # Puppeteer lifecycle
│   │   │   └── SchedulerService.ts    # Cron job handler
│   │   └── platforms/
│   │       ├── BasePlatform.ts        # Abstract base class
│   │       ├── ClassPassAutomation.ts
│   │       ├── MindbodyAutomation.ts
│   │       ├── BarrysAutomation.ts
│   │       ├── SLTAutomation.ts
│   │       └── Y7Automation.ts
│   └── utils/
│       ├── logger.ts
│       └── validators.ts
└── tests/
    ├── unit/
    └── integration/
```

#### Key Backend Technologies

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Browser Automation**: Puppeteer + puppeteer-extra-plugin-stealth
- **Database Client**: Supabase JavaScript Client
- **Email**: Resend SDK
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Logging**: Winston

#### Backend Request Flow

```
HTTP Request
      │
      ▼
Express Middleware (rate limiting, validation)
      │
      ▼
Controller (handles request/response)
      │
      ▼
Service Layer (business logic)
      │
      ├──▶ Database (Supabase)
      │
      └──▶ External Services (Email, Automation)
      │
      ▼
Response to Client
```

---

## 4. Data Architecture

### 4.1 Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credentials table (encrypted)
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'classpass', 'mindbody', 'barrys', 'slt', 'y7'
    encrypted_username TEXT NOT NULL,
    encrypted_password TEXT NOT NULL,
    iv TEXT NOT NULL, -- Initialization vector for encryption
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- Booking preferences
CREATE TABLE booking_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    studio_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    class_date DATE NOT NULL,
    class_time TIME NOT NULL,
    instructor VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking history
CREATE TABLE booking_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    preference_id UUID REFERENCES booking_preferences(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    studio_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    class_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    instructor VARCHAR(255),
    result VARCHAR(50) NOT NULL, -- 'success', 'waitlisted', 'failed', 'error'
    error_message TEXT,
    attempt_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking runs (tracks each monthly execution)
CREATE TABLE booking_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    total_attempts INTEGER DEFAULT 0,
    successful_bookings INTEGER DEFAULT 0,
    waitlisted_bookings INTEGER DEFAULT 0,
    failed_bookings INTEGER DEFAULT 0,
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_credentials_user_id ON credentials(user_id);
CREATE INDEX idx_booking_preferences_user_id ON booking_preferences(user_id);
CREATE INDEX idx_booking_preferences_date ON booking_preferences(class_date);
CREATE INDEX idx_booking_history_user_id ON booking_history(user_id);
CREATE INDEX idx_booking_history_result ON booking_history(result);
CREATE INDEX idx_booking_runs_user_id ON booking_runs(user_id);
```

### 4.2 Data Encryption Strategy

**Credential Encryption Flow**:

```
┌──────────────────────────────────────────────────────────────┐
│                        ENCRYPTION                            │
│                                                              │
│  Plain Text         Encryption Key      Random IV           │
│  Username/Password  (from env var)      (generated)         │
│       │                    │                 │              │
│       └────────────────────┼─────────────────┘              │
│                            │                                │
│                            ▼                                │
│                   AES-256-GCM Encryption                    │
│                            │                                │
│                            ▼                                │
│                  Encrypted Data + Auth Tag                  │
│                            │                                │
│                            ▼                                │
│                   Store in Database                         │
│                   (encrypted_username,                      │
│                    encrypted_password, iv)                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                        DECRYPTION                            │
│                                                              │
│  Encrypted Data     Encryption Key      Stored IV           │
│  from Database      (from env var)      (from DB)           │
│       │                    │                 │              │
│       └────────────────────┼─────────────────┘              │
│                            │                                │
│                            ▼                                │
│                   AES-256-GCM Decryption                    │
│                            │                                │
│                            ▼                                │
│                   Plain Text Credentials                    │
│                            │                                │
│                            ▼                                │
│                   Use in Puppeteer                          │
└──────────────────────────────────────────────────────────────┘
```

**Encryption Implementation**:

```typescript
// backend/src/config/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes

export function encrypt(text: string): {
  encrypted: string;
  iv: string;
  authTag: string;
} {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export function decrypt(encrypted: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

---

## 5. Security Architecture

### 5.1 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Network Security                              │
│ - HTTPS only (TLS 1.3)                                 │
│ - CORS configured                                      │
│ - Rate limiting (express-rate-limit)                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Application Security                          │
│ - Input validation (Zod schemas)                       │
│ - SQL injection prevention (parameterized queries)     │
│ - XSS prevention (React escaping)                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Authentication & Authorization                 │
│ - JWT tokens (future)                                  │
│ - Session management                                   │
│ - User isolation                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Data Security                                 │
│ - AES-256-GCM encryption for credentials               │
│ - Environment variable secrets                         │
│ - No sensitive data in logs                            │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Security Best Practices

1. **Credential Storage**
   - Never store plain-text passwords
   - Use authenticated encryption (GCM mode)
   - Rotate encryption keys regularly

2. **API Security**
   - Rate limiting: 100 requests per 15 minutes per IP
   - Request size limits: 10MB max
   - Timeout: 30 seconds per request

3. **Browser Automation Security**
   - Run in sandboxed container
   - No persistent browser storage
   - Clear cookies after each run
   - Use stealth plugin to avoid detection

4. **Environment Variables**
   - Never commit `.env` files
   - Use strong, random encryption keys (256-bit)
   - Rotate API keys periodically

5. **Logging Security**
   - Redact sensitive data (passwords, tokens)
   - Log authentication attempts
   - Monitor for suspicious patterns

---

## 6. Deployment Architecture

### 6.1 Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Next.js Frontend                                  │    │
│  │  - Static Site Generation (SSG)                    │    │
│  │  - Server-Side Rendering (SSR)                     │    │
│  │  - Edge Functions                                  │    │
│  │  - Global CDN                                      │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS API Calls
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                         RENDER                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Express.js API (Web Service)                      │    │
│  │  - Container: Docker (Node.js 20)                  │    │
│  │  - Auto-deploy from main branch                    │    │
│  │  - Health checks: /health endpoint                 │    │
│  │  - Logs: Real-time via Render dashboard            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Cron Job Service                                  │    │
│  │  - Schedule: "1 0 21 * *" (12:01 AM on 21st)      │    │
│  │  - Calls: POST /api/bookings/run                   │    │
│  │  - Timeout: 30 minutes                             │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
           ▼                ▼                ▼
     ┌──────────┐    ┌──────────┐    ┌──────────┐
     │ SUPABASE │    │  RESEND  │    │  CHROME  │
     │          │    │          │    │ PUPPETEER│
     │ PostgreSQL│   │ Email API│    │ HEADLESS │
     └──────────┘    └──────────┘    └──────────┘
```

### 6.2 Deployment Configuration

**Vercel Configuration** (`vercel.json`):
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://fitness-autobooker-api.onrender.com"
  }
}
```

**Render Configuration** (`render.yaml`):
```yaml
services:
  - type: web
    name: fitness-autobooker-api
    env: node
    plan: free
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_ANON_KEY
        sync: false
      - key: ENCRYPTION_KEY
        generateValue: true
      - key: RESEND_API_KEY
        sync: false
    healthCheckPath: /health

  - type: cron
    name: booking-scheduler
    env: node
    plan: free
    schedule: "1 0 21 * *"
    buildCommand: cd backend && npm install
    startCommand: curl -X POST https://fitness-autobooker-api.onrender.com/api/bookings/run
```

### 6.3 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                    Developer                            │
│                    git push                             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   GitHub                                │
│   - Source control                                      │
│   - Pull request reviews                                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Actions                             │
│   ┌──────────────────────────────────────────────┐     │
│   │ 1. Lint (ESLint)                             │     │
│   │ 2. Type Check (TypeScript)                   │     │
│   │ 3. Run Tests (Jest)                          │     │
│   │ 4. Build Frontend                            │     │
│   │ 5. Build Backend                             │     │
│   └──────────────────────────────────────────────┘     │
└────────────┬───────────────────────┬────────────────────┘
             │                       │
             ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │   VERCEL    │         │   RENDER    │
    │ Auto-deploy │         │ Auto-deploy │
    │  Frontend   │         │   Backend   │
    └─────────────┘         └─────────────┘
```

**GitHub Actions Workflow** (`.github/workflows/ci.yml`):
```yaml
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      # Frontend tests
      - name: Install frontend dependencies
        run: cd frontend && npm ci
      - name: Lint frontend
        run: cd frontend && npm run lint
      - name: Type check frontend
        run: cd frontend && npm run type-check
      - name: Test frontend
        run: cd frontend && npm test

      # Backend tests
      - name: Install backend dependencies
        run: cd backend && npm ci
      - name: Lint backend
        run: cd backend && npm run lint
      - name: Type check backend
        run: cd backend && npm run type-check
      - name: Test backend
        run: cd backend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: echo "Vercel and Render auto-deploy on push to main"
```

---

## 7. Automation Engine

### 7.1 Booking Engine Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  BookingEngine                           │
│  (Orchestrates entire booking process)                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ 1. Fetch preferences
                         ▼
┌──────────────────────────────────────────────────────────┐
│              PreferenceService                           │
│  - Get user preferences sorted by priority               │
│  - Filter active preferences                             │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ 2. Get credentials
                         ▼
┌──────────────────────────────────────────────────────────┐
│              CredentialService                           │
│  - Fetch encrypted credentials                           │
│  - Decrypt for use                                       │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ 3. Launch browser
                         ▼
┌──────────────────────────────────────────────────────────┐
│              BrowserManager                              │
│  - Launch Puppeteer with stealth                         │
│  - Manage browser lifecycle                              │
│  - Handle crashes and timeouts                           │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ 4. Execute platform automation
                         ▼
┌──────────────────────────────────────────────────────────┐
│           Platform-Specific Automation                   │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ ClassPass  │  │ Mindbody   │  │  Barry's   │        │
│  └────────────┘  └────────────┘  └────────────┘        │
│  ┌────────────┐  ┌────────────┐                        │
│  │    SLT     │  │     Y7     │                        │
│  └────────────┘  └────────────┘                        │
│                                                          │
│  Each platform inherits from BasePlatform:              │
│  - login(credentials)                                    │
│  - navigateToSchedule(date)                              │
│  - findClass(preferences)                                │
│  - bookClass()                                           │
│  - joinWaitlist()                                        │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ 5. Record results
                         ▼
┌──────────────────────────────────────────────────────────┐
│              BookingHistoryService                       │
│  - Save booking attempts                                 │
│  - Track success/failure                                 │
│  - Log execution time                                    │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ 6. Send notification
                         ▼
┌──────────────────────────────────────────────────────────┐
│              EmailService                                │
│  - Format results                                        │
│  - Send summary email                                    │
└──────────────────────────────────────────────────────────┘
```

### 7.2 BasePlatform Abstract Class

```typescript
// backend/src/automation/platforms/BasePlatform.ts
import { Page } from 'puppeteer';

export interface BookingResult {
  success: boolean;
  status: 'booked' | 'waitlisted' | 'failed';
  message: string;
  executionTimeMs: number;
}

export interface BookingPreference {
  platform: string;
  studioName: string;
  className: string;
  date: Date;
  time: string;
  instructor?: string;
}

export abstract class BasePlatform {
  protected page: Page;
  protected platformName: string;

  constructor(page: Page, platformName: string) {
    this.page = page;
    this.platformName = platformName;
  }

  abstract login(username: string, password: string): Promise<void>;
  abstract navigateToSchedule(date: Date): Promise<void>;
  abstract findClass(preference: BookingPreference): Promise<boolean>;
  abstract bookClass(): Promise<BookingResult>;
  abstract joinWaitlist(): Promise<BookingResult>;

  protected async waitForSelector(selector: string, timeout = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  protected async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  protected async typeText(selector: string, text: string): Promise<void> {
    await this.page.type(selector, text);
  }

  protected async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
```

### 7.3 Example Platform Implementation

```typescript
// backend/src/automation/platforms/ClassPassAutomation.ts
import { BasePlatform, BookingResult, BookingPreference } from './BasePlatform';

export class ClassPassAutomation extends BasePlatform {
  constructor(page: Page) {
    super(page, 'ClassPass');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.goto('https://classpass.com/login');
    await this.typeText('input[name="email"]', username);
    await this.typeText('input[name="password"]', password);
    await this.clickElement('button[type="submit"]');
    await this.page.waitForNavigation();
  }

  async navigateToSchedule(date: Date): Promise<void> {
    // Navigate to schedule for specific date
    const dateString = date.toISOString().split('T')[0];
    await this.page.goto(`https://classpass.com/schedule?date=${dateString}`);
  }

  async findClass(preference: BookingPreference): Promise<boolean> {
    // Search for specific class
    // This is platform-specific logic
    // Returns true if class found, false otherwise
    const classes = await this.page.$$('.class-listing');

    for (const classElement of classes) {
      const name = await classElement.$eval('.class-name', el => el.textContent);
      const time = await classElement.$eval('.class-time', el => el.textContent);
      const studio = await classElement.$eval('.studio-name', el => el.textContent);

      if (
        name?.includes(preference.className) &&
        time?.includes(preference.time) &&
        studio?.includes(preference.studioName)
      ) {
        await classElement.click();
        return true;
      }
    }

    return false;
  }

  async bookClass(): Promise<BookingResult> {
    const startTime = Date.now();

    try {
      const bookButton = await this.page.$('button.book-class');

      if (!bookButton) {
        return {
          success: false,
          status: 'failed',
          message: 'Book button not found',
          executionTimeMs: Date.now() - startTime
        };
      }

      await bookButton.click();
      await this.page.waitForSelector('.booking-confirmation', { timeout: 5000 });

      return {
        success: true,
        status: 'booked',
        message: 'Class booked successfully',
        executionTimeMs: Date.now() - startTime
      };
    } catch (error) {
      // Class might be full, try waitlist
      return await this.joinWaitlist();
    }
  }

  async joinWaitlist(): Promise<BookingResult> {
    const startTime = Date.now();

    try {
      const waitlistButton = await this.page.$('button.join-waitlist');

      if (!waitlistButton) {
        return {
          success: false,
          status: 'failed',
          message: 'Class full and no waitlist available',
          executionTimeMs: Date.now() - startTime
        };
      }

      await waitlistButton.click();
      await this.page.waitForSelector('.waitlist-confirmation', { timeout: 5000 });

      return {
        success: true,
        status: 'waitlisted',
        message: 'Added to waitlist',
        executionTimeMs: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: `Error: ${error.message}`,
        executionTimeMs: Date.now() - startTime
      };
    }
  }
}
```

### 7.4 Scheduler Service

```typescript
// backend/src/automation/core/SchedulerService.ts
import { BookingEngine } from './BookingEngine';

export class SchedulerService {
  private bookingEngine: BookingEngine;

  constructor() {
    this.bookingEngine = new BookingEngine();
  }

  /**
   * Main entry point called by Render Cron Job
   * Runs at 12:01 AM on the 21st of each month
   */
  async executeMonthlyBooking(): Promise<void> {
    console.log('🚀 Starting monthly booking run...');

    try {
      // Get all users (for now, single user MVP)
      const userId = process.env.DEFAULT_USER_ID;

      // Execute booking for user
      const results = await this.bookingEngine.runBookingProcess(userId);

      console.log('✅ Monthly booking run completed');
      console.log(`Results: ${JSON.stringify(results, null, 2)}`);
    } catch (error) {
      console.error('❌ Monthly booking run failed:', error);
      throw error;
    }
  }
}
```

---

## 8. API Design

### 8.1 REST API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **Credentials** | | | |
| POST | `/api/credentials` | Add platform credentials | ✓ |
| GET | `/api/credentials` | Get all credentials (encrypted) | ✓ |
| PUT | `/api/credentials/:id` | Update credentials | ✓ |
| DELETE | `/api/credentials/:id` | Delete credentials | ✓ |
| **Preferences** | | | |
| POST | `/api/preferences` | Add booking preference | ✓ |
| GET | `/api/preferences` | Get all preferences | ✓ |
| PUT | `/api/preferences/:id` | Update preference | ✓ |
| DELETE | `/api/preferences/:id` | Delete preference | ✓ |
| **Bookings** | | | |
| POST | `/api/bookings/run` | Manually trigger booking (testing) | ✓ |
| GET | `/api/bookings/history` | Get booking history | ✓ |
| GET | `/api/bookings/runs` | Get booking run history | ✓ |
| **Health** | | | |
| GET | `/health` | Health check endpoint | - |

### 8.2 API Request/Response Examples

**POST `/api/credentials`**

Request:
```json
{
  "platform": "classpass",
  "username": "user@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "platform": "classpass",
    "username": "user@example.com",
    "isActive": true,
    "createdAt": "2026-03-06T12:00:00Z"
  }
}
```

**POST `/api/preferences`**

Request:
```json
{
  "platform": "barrys",
  "studioName": "Barry's Lincoln Park",
  "className": "Full Body",
  "date": "2026-04-15",
  "time": "06:00",
  "instructor": "Sarah Johnson",
  "priority": "high"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "456e7890-e89b-12d3-a456-426614174111",
    "platform": "barrys",
    "studioName": "Barry's Lincoln Park",
    "className": "Full Body",
    "date": "2026-04-15",
    "time": "06:00",
    "instructor": "Sarah Johnson",
    "priority": "high",
    "isActive": true,
    "createdAt": "2026-03-06T12:00:00Z"
  }
}
```

---

## 9. Error Handling Strategy

### 9.1 Error Categories

```typescript
export enum ErrorCategory {
  VALIDATION = 'validation',      // Invalid input data
  AUTHENTICATION = 'authentication', // Login failures
  AUTOMATION = 'automation',      // Browser automation errors
  NETWORK = 'network',           // Network/timeout errors
  DATABASE = 'database',         // Database errors
  PLATFORM = 'platform',         // Platform-specific errors
  SYSTEM = 'system'              // Unexpected system errors
}

export class AppError extends Error {
  constructor(
    public category: ErrorCategory,
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}
```

### 9.2 Retry Logic

```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
```

---

## 10. Performance Considerations

### 10.1 Optimization Strategies

1. **Database Queries**
   - Use indexes on frequently queried columns
   - Limit result sets with pagination
   - Use connection pooling

2. **Browser Automation**
   - Reuse browser instances when possible
   - Use headless mode (faster)
   - Disable unnecessary resources (images, CSS for some steps)
   - Parallel execution for multiple platforms

3. **API Performance**
   - Implement caching for static data
   - Compress responses (gzip)
   - Use CDN for frontend assets (Vercel)

4. **Frontend Performance**
   - Code splitting
   - Lazy loading components
   - Image optimization
   - Static generation where possible

### 10.2 Monitoring

```typescript
// Performance monitoring middleware
export function performanceMonitor(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);

    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
}
```

---

## 11. Scalability

### 11.1 Current Limitations (MVP)

- Single user support
- Single region deployment
- Sequential booking execution
- 750 hours/month Render limit

### 11.2 Scaling Strategy (Future)

**Phase 1: Multi-User (10-100 users)**
- Add user authentication (Supabase Auth)
- Implement user isolation
- Add background job queue (Bull/Redis)

**Phase 2: Regional Scale (100-1000 users)**
- Multi-region deployment
- Database read replicas
- Horizontal scaling (multiple Render instances)
- Implement caching layer (Redis)

**Phase 3: National Scale (1000+ users)**
- Migrate to paid infrastructure
- Kubernetes orchestration
- Dedicated database servers
- Real-time monitoring (Datadog/New Relic)
- Load balancing

---

## Conclusion

This architecture is designed to be:
- **Cost-effective**: Runs entirely on free tiers
- **Secure**: Multiple layers of security
- **Maintainable**: Clear separation of concerns
- **Scalable**: Can grow with user demand
- **Reliable**: Comprehensive error handling

The modular design allows for easy platform additions and future enhancements while maintaining code quality and security standards.
