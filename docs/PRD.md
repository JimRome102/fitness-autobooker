# Product Requirements Document: Fitness Class Auto-Booker

## 1. Executive Summary

**Product Name**: FitBook Auto
**Version**: 1.0
**Date**: March 6, 2026
**Status**: Planning

### Problem Statement
Popular fitness classes at boutique studios release their schedules at midnight on the 21st of each month and fill up within hours. Users must wake up at midnight to book their preferred classes, which is unsustainable.

### Solution
An automated booking system that runs at midnight on the 21st of each month, books preferred classes across multiple platforms, and sends a summary email of results.

---

## 2. User Requirements

### Target User
- Fitness enthusiast who attends 4-8 classes per month
- Uses 3-5 different studios across multiple booking platforms
- Values sleep over manual midnight bookings
- Tech-savvy enough to configure a calendar interface

### User Stories

1. **As a user**, I want to configure my preferred class schedule for the upcoming month using a calendar interface, so I don't have to wake up at midnight.

2. **As a user**, I want the system to automatically book my classes at midnight on the 21st, so I can secure spots in popular classes.

3. **As a user**, I want the system to join waitlists if my preferred class is full, so I have a chance if spots open up.

4. **As a user**, I want to receive an email summary of booking results, so I know what was booked and what I'm waitlisted for.

5. **As a user**, I want to manage credentials for multiple platforms (ClassPass, Mindbody, Barry's, SLT, Y7) in one place.

---

## 3. Functional Requirements

### 3.1 Calendar Configuration Interface

**Priority**: P0 (Must Have)

- Display calendar view for upcoming month after the 21st
- Allow user to add "booking preferences" for specific dates/times
- For each preference, capture:
  - Date & Time
  - Platform (ClassPass / Mindbody / Barry's / SLT / Y7)
  - Studio name
  - Class type/name
  - Instructor (optional)
  - Priority level (High/Medium/Low)
- Save/edit/delete preferences
- Set configuration deadline (e.g., must be set by midnight on the 20th)

### 3.2 Credential Management

**Priority**: P0 (Must Have)

- Secure storage for platform login credentials
- Support for:
  - ClassPass (username/password)
  - Mindbody (username/password)
  - Barry's (username/password)
  - SLT (username/password)
  - Y7 (username/password)
- Encrypt credentials at rest
- Allow user to update credentials

### 3.3 Automated Booking Engine

**Priority**: P0 (Must Have)

- Triggered automatically at 12:01 AM on the 21st of each month
- For each booking preference (ordered by priority):
  1. Launch browser automation for the specific platform
  2. Log in using stored credentials
  3. Navigate to class schedule
  4. Search for specified class
  5. Attempt to book
  6. If full, attempt to join waitlist
  7. Record result (success/waitlisted/failed)
- Handle errors gracefully (timeout, network issues, etc.)
- Retry logic for transient failures
- Maximum execution time: 30 minutes

### 3.4 Notification System

**Priority**: P0 (Must Have)

- Send email summary after all bookings complete
- Email includes:
  - Successfully booked classes (date, time, studio, instructor)
  - Waitlisted classes
  - Failed bookings with reason
  - Next steps/recommendations
- Use free email service (Resend, SendGrid, or similar)

### 3.5 Logging & History

**Priority**: P1 (Should Have)

- Store booking attempt history
- View past booking runs
- Debug logs for troubleshooting
- Success rate metrics

---

## 4. Non-Functional Requirements

### 4.1 Performance
- System must complete all bookings within 30 minutes
- Calendar UI should load within 2 seconds

### 4.2 Reliability
- 95% success rate for booking attempts (when class is available)
- System must handle platform outages gracefully

### 4.3 Security
- All credentials encrypted using industry-standard encryption (AES-256)
- No credentials stored in plain text
- HTTPS for all web communications

### 4.4 Cost
- Must run entirely on free tiers
- Zero recurring monthly costs

### 4.5 Usability
- Calendar configuration should take < 5 minutes
- Clear error messages
- Mobile-responsive design

---

## 5. Technical Architecture

### 5.1 System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         User (Browser)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend (React/Next.js)                      │
│  ┌──────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │ Calendar Config  │  │ Credential Mgmt │  │ Booking History│ │
│  └──────────────────┘  └─────────────────┘  └────────────────┘ │
│                     (Deployed on Vercel)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ API Calls
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend API (Node.js/Express)                      │
│  ┌──────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │ Config API       │  │ Auth API        │  │ Status API     │ │
│  └──────────────────┘  └─────────────────┘  └────────────────┘ │
│                     (Deployed on Render)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   Database   │  │   Scheduler  │  │ Booking Engine   │
│  (Supabase)  │  │ (Render Cron)│  │  (Puppeteer)     │
│              │  │              │  │                  │
│ - User prefs │  │ Triggers at  │  │ - Browser automation│
│ - Credentials│  │ 12:01 AM on  │  │ - Multi-platform │
│ - History    │  │ 21st of month│  │ - Error handling │
└──────────────┘  └──────────────┘  └──────────────────┘
                         │
                         │
                         ▼
                  ┌──────────────┐
                  │ Email Service│
                  │   (Resend)   │
                  │              │
                  │ Send summary │
                  └──────────────┘
```

### 5.2 Technology Stack

**Frontend**:
- Framework: Next.js (React)
- UI Library: Tailwind CSS + shadcn/ui
- Calendar: FullCalendar or react-big-calendar
- Deployment: Vercel (free tier)

**Backend**:
- Runtime: Node.js 20+
- Framework: Express.js
- Browser Automation: Puppeteer (headless Chrome)
- Deployment: Render (free tier)

**Database**:
- Supabase (PostgreSQL, free tier: 500MB storage)
- Tables:
  - `users` (id, email, created_at)
  - `credentials` (id, user_id, platform, encrypted_username, encrypted_password)
  - `booking_preferences` (id, user_id, date, time, platform, studio, class_type, instructor, priority)
  - `booking_history` (id, user_id, preference_id, result, timestamp, details)

**Scheduler**:
- Render Cron Jobs (free tier)
- Alternative: GitHub Actions (limited minutes)

**Email**:
- Resend (free tier: 100 emails/day)
- Alternative: SendGrid (free tier: 100 emails/day)

### 5.3 Platform-Specific Integrations

Each platform requires custom browser automation:

1. **ClassPass**:
   - Login flow: classpass.com/login
   - Schedule navigation
   - Booking flow
   - Waitlist flow

2. **Mindbody**:
   - Login varies by studio (studiodomain.mindbodyonline.com)
   - Multi-studio complexity
   - Different UI variations

3. **Barry's**:
   - barrys.com login
   - Proprietary booking interface
   - Potential CAPTCHA

4. **SLT**:
   - sltmethod.com login
   - Class selection flow

5. **Y7**:
   - y7studio.com login
   - Booking flow

### 5.4 Security Considerations

- **Credential Encryption**: Use `crypto` library with AES-256-GCM
- **Environment Variables**: Store encryption keys in Render environment variables
- **HTTPS Only**: All communications over HTTPS
- **Rate Limiting**: Implement API rate limiting to prevent abuse
- **Input Validation**: Sanitize all user inputs

### 5.5 Free Tier Budget

| Service | Free Tier Limits | Usage Estimate |
|---------|------------------|----------------|
| Vercel | 100GB bandwidth/month | < 1GB |
| Render | 750 hours/month | ~30 minutes/month |
| Supabase | 500MB storage, 2GB transfer | < 50MB |
| Resend | 100 emails/day | 1-2 emails/month |

**Total Cost**: $0/month ✅

---

## 6. User Experience Design

### 6.1 User Flow

```
1. New User Signup/Login
   ↓
2. Add Platform Credentials
   (ClassPass, Mindbody, Barry's, SLT, Y7)
   ↓
3. Configure Calendar Preferences
   (Add classes to book for upcoming month)
   ↓
4. Review & Confirm Configuration
   ↓
5. Wait for 21st at Midnight
   ↓
6. System Automatically Runs
   ↓
7. Receive Email Summary
   ↓
8. View Results in Dashboard
```

### 6.2 Key Screens

**Screen 1: Dashboard**
- Welcome message
- Next booking run countdown
- Quick stats (total classes configured, last run status)
- Quick actions: Add credentials, Configure classes, View history

**Screen 2: Credentials Management**
- List of platforms with status indicators (configured / not configured)
- Add/Edit credential forms for each platform
- Test connection button
- Security note about encryption

**Screen 3: Calendar Configuration**
- Month view calendar
- Click on date/time to add booking preference
- Modal form:
  - Platform dropdown
  - Studio name input
  - Class type/name input
  - Instructor input (optional)
  - Priority radio buttons (High/Medium/Low)
- List view of all configured preferences
- Drag-and-drop to reorder priorities

**Screen 4: Booking History**
- Table of past booking runs
- Filters: Date range, Platform, Status
- Expandable rows showing details
- Success rate metrics

**Screen 5: Email Summary Template**
- Header: "Your Fitness Class Booking Results"
- Section 1: Successfully Booked Classes
- Section 2: Waitlisted Classes
- Section 3: Failed Bookings (with reasons)
- Footer: View full details in dashboard

---

## 7. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Platform adds CAPTCHA | High | Medium | Manual intervention alert, explore CAPTCHA solving services |
| Platform changes UI | High | Medium | Modular design, easy to update selectors, monitoring alerts |
| Free tier limits exceeded | Medium | Low | Monitor usage, have backup free services |
| Credentials compromised | High | Low | Encryption, security best practices, 2FA consideration |
| Multiple users overload system | Medium | Low | Start with single user, add rate limiting |
| Browser automation detection | High | Medium | Use puppeteer-extra with stealth plugin |

---

## 8. Success Metrics

**Primary Metrics**:
- **Booking Success Rate**: % of attempted bookings that succeed (target: 90%+)
- **Waitlist Rate**: % of bookings that result in waitlist (tracking metric)
- **System Uptime**: % of scheduled runs that execute (target: 99%+)

**Secondary Metrics**:
- Time saved per month (vs manual booking)
- User satisfaction score
- Number of platforms successfully integrated

---

## 9. Future Enhancements (Post-MVP)

### Phase 2:
- SMS notifications (via Twilio free trial)
- Multi-user support
- Mobile app (React Native)
- Smart scheduling suggestions based on past bookings

### Phase 3:
- Integration with calendar apps (Google Calendar, Apple Calendar)
- Class recommendation engine
- Social features (see where friends are going)
- Payment automation (if classes require payment)

---

## 10. Development Phases

### Phase 1: MVP (Week 1-2)
- Single platform support (start with easiest one)
- Basic calendar config
- Manual trigger (not scheduled)
- Email summary

### Phase 2: Multi-Platform (Week 3-4)
- Add remaining 4 platforms
- Automated scheduling (cron)
- Error handling & retries

### Phase 3: Polish (Week 5-6)
- UI improvements
- History tracking
- Performance optimization
- Documentation

---

## 11. Open Questions

1. **2FA Handling**: If platforms require 2FA, how should we handle this? (May need to disable 2FA or use app-specific passwords)

2. **CAPTCHA**: If CAPTCHAs appear, should we alert user for manual intervention or explore solving services?

3. **Payment**: Do these platforms require payment at booking time, or is it membership-based?

4. **Timezone**: What timezone should the system use for the midnight trigger?

5. **Testing**: How can we test without actually booking real classes?

---

## 12. Appendix

### A. Competitor Analysis
- **None found**: No existing solution for multi-platform automated fitness booking

### B. Glossary
- **Booking Preference**: User's desired class to book (date, time, studio, class type)
- **Priority**: Order in which system attempts bookings (High/Medium/Low)
- **Waitlist**: Joining class waiting list when class is full

### C. References
- Puppeteer Documentation: https://pptr.dev/
- Render Cron Jobs: https://render.com/docs/cronjobs
- Supabase Documentation: https://supabase.com/docs

---

**Document Prepared By**: Claude (AI Product Manager)
**Last Updated**: March 6, 2026
**Next Review**: After user feedback on PRD
