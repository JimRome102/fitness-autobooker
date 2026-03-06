# FitBook Auto - UI/UX Design & Mockups

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [User Flows](#user-flows)
3. [Wireframes](#wireframes)
4. [Component Library](#component-library)
5. [Color Palette](#color-palette)
6. [Typography](#typography)
7. [Responsive Design](#responsive-design)

---

## 1. Design Philosophy

### Design Principles

1. **Simplicity First**
   - Clean, minimal interface
   - Focus on essential actions
   - No unnecessary clutter

2. **Clarity**
   - Clear visual hierarchy
   - Obvious calls-to-action
   - Immediate feedback

3. **Efficiency**
   - Minimize clicks to complete tasks
   - Keyboard shortcuts for power users
   - Quick access to frequent actions

4. **Trust & Security**
   - Clear security indicators
   - Transparent data handling
   - Confidence-building design

5. **Delight**
   - Smooth animations
   - Success celebrations
   - Encouraging copy

### Design Inspiration

- **ClassPass** - Clean class booking interface
- **Calendly** - Intuitive calendar selection
- **1Password** - Secure credential management
- **Linear** - Modern, fast, keyboard-first

---

## 2. User Flows

### 2.1 Primary User Flow: Setting Up Monthly Bookings

```
┌─────────────────────────────────────────────────────────────┐
│                    FIRST TIME USER                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Landing / Dashboard                                │
│  - Welcome message                                          │
│  - "Get Started" CTA                                        │
│  - Empty state illustration                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Add Platform Credentials                           │
│  - Select platform (ClassPass, Mindbody, etc.)              │
│  - Enter username/password                                  │
│  - Security note                                            │
│  - "Test Connection" button                                 │
│  - Save credentials                                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Configure Calendar                                 │
│  - Month view calendar                                      │
│  - Click date/time to add preference                        │
│  - Modal: Fill in class details                             │
│  - Set priority (High/Medium/Low)                           │
│  - Add multiple preferences                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Review & Confirm                                   │
│  - List of all configured bookings                          │
│  - Total count                                              │
│  - Next run date/time                                       │
│  - "Confirm" button                                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Wait for Midnight                                  │
│  - Dashboard with countdown                                 │
│  - Can edit preferences until 11:59 PM on 20th              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Automatic Execution (12:01 AM on 21st)             │
│  - System runs automatically                                │
│  - User receives email                                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 7: View Results                                       │
│  - Dashboard shows results                                  │
│  - Successfully booked classes (green)                      │
│  - Waitlisted classes (yellow)                              │
│  - Failed bookings (red)                                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Returning User Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard (Returning User)                                 │
│  - Last booking run results                                 │
│  - Next run countdown                                       │
│  - Quick actions: Configure classes, View history           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ├──> Configure Classes for Next Month
                           │
                           ├──> View Booking History
                           │
                           └──> Manage Credentials
```

---

## 3. Wireframes

### 3.1 Dashboard (Landing Page)

```
┌────────────────────────────────────────────────────────────────────┐
│  FitBook Auto                    [Settings] [Profile]              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                  Next Booking Run Countdown                 │  │
│  │                                                             │  │
│  │              ⏰  12 days, 5 hours, 23 minutes               │  │
│  │                                                             │  │
│  │         Scheduled: March 21, 2026 at 12:01 AM EST          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Quick Stats                                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │    8     │  │    5     │  │   95%    │  │   Last   │   │  │
│  │  │ Classes  │  │ Platforms│  │ Success  │  │ Run: 7d  │   │  │
│  │  │ Configured│ │ Connected│  │   Rate   │  │   ago    │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Quick Actions                                              │  │
│  │                                                             │  │
│  │  [📅 Configure Classes]  [🔐 Manage Credentials]           │  │
│  │                                                             │  │
│  │  [📊 View History]       [⚙️ Settings]                     │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Last Booking Run (Feb 21, 2026)                           │  │
│  │                                                             │  │
│  │  ✅ Barry's Full Body - 6:00 AM         Successfully Booked│  │
│  │  ✅ SLT Megaformer - 7:00 AM            Successfully Booked│  │
│  │  ⏳ Y7 Hot Yoga - 6:30 AM               Waitlisted         │  │
│  │  ✅ ClassPass Spin - 7:30 AM            Successfully Booked│  │
│  │                                                             │  │
│  │  [View Full Results →]                                     │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 Calendar Configuration Page

```
┌────────────────────────────────────────────────────────────────────┐
│  FitBook Auto > Configure Classes                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Configure Classes for April 2026                                 │
│  Deadline: March 20, 2026 at 11:59 PM                            │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Calendar View                [Month ▼]  [List View]        │  │
│  │                                                             │  │
│  │     Sun    Mon    Tue    Wed    Thu    Fri    Sat          │  │
│  │                    1      2      3      4      5            │  │
│  │                         [6AM]  [6AM]  [6AM]                │  │
│  │                         Barry  SLT    Y7                    │  │
│  │                                                             │  │
│  │     6      7      8      9     10     11     12             │  │
│  │          [6AM]         [6AM]                  [9AM]         │  │
│  │          Barry         SLT                    ClassPass     │  │
│  │                                                             │  │
│  │    13     14     15     16     17     18     19             │  │
│  │          [6AM]         [6AM]         [7PM]                 │  │
│  │          Barry         SLT           Y7                     │  │
│  │                                                             │  │
│  │    20     21     22     23     24     25     26             │  │
│  │                 [+]                                         │  │
│  │                                                             │  │
│  │    27     28     29     30                                  │  │
│  │                                                             │  │
│  │                                                             │  │
│  │  Click any date to add a class preference                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Configured Classes (8)                     [+ Add Class]  │  │
│  │                                                             │  │
│  │  🔴 HIGH    Apr 2, 6:00 AM - Barry's Full Body             │  │
│  │            Barry's Lincoln Park | Sarah Johnson      [Edit]│  │
│  │                                                             │  │
│  │  🔴 HIGH    Apr 4, 6:00 AM - SLT Megaformer                │  │
│  │            SLT Loop | Mike Chen                       [Edit]│  │
│  │                                                             │  │
│  │  🟡 MEDIUM  Apr 3, 6:00 AM - Y7 Hot Yoga                   │  │
│  │            Y7 West Loop | Any instructor              [Edit]│  │
│  │                                                             │  │
│  │  ... 5 more classes                                        │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  [Cancel]                                          [Save Changes] │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 3.3 Add/Edit Class Preference Modal

```
┌────────────────────────────────────────────────────────────┐
│  Add Class Preference                              [X]     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Platform *                                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ClassPass                                        [▼] │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Studio Name *                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Barry's Lincoln Park                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Class Type/Name *                                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Full Body                                            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Date & Time *                                             │
│  ┌─────────────────────────┐  ┌──────────────────────┐    │
│  │ April 15, 2026          │  │ 6:00 AM          [▼]│    │
│  └─────────────────────────┘  └──────────────────────┘    │
│                                                            │
│  Instructor (optional)                                     │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Sarah Johnson                                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Priority *                                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ⚪ High    ⚪ Medium    ⚪ Low                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ℹ️  High priority classes will be booked first          │
│                                                            │
│  [Cancel]                               [Add Preference]  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 3.4 Credentials Management Page

```
┌────────────────────────────────────────────────────────────────────┐
│  FitBook Auto > Manage Credentials                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  🔒 Your credentials are encrypted and stored securely            │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  ClassPass                                        ✅ Active  │  │
│  │                                                             │  │
│  │  Username: user@example.com                                 │  │
│  │  Last updated: Feb 20, 2026                                 │  │
│  │                                                             │  │
│  │  [Test Connection]  [Edit]  [Remove]                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Mindbody                                         ✅ Active  │  │
│  │                                                             │  │
│  │  Username: user@example.com                                 │  │
│  │  Last updated: Feb 20, 2026                                 │  │
│  │                                                             │  │
│  │  [Test Connection]  [Edit]  [Remove]                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Barry's                                          ❌ Not Set │  │
│  │                                                             │  │
│  │  [Add Credentials]                                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  SLT                                              ✅ Active  │  │
│  │                                                             │  │
│  │  Username: user@example.com                                 │  │
│  │  Last updated: Feb 20, 2026                                 │  │
│  │                                                             │  │
│  │  [Test Connection]  [Edit]  [Remove]                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Y7 Studio                                        ❌ Not Set │  │
│  │                                                             │  │
│  │  [Add Credentials]                                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 3.5 Booking History Page

```
┌────────────────────────────────────────────────────────────────────┐
│  FitBook Auto > Booking History                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Filters:  [All Platforms ▼]  [All Results ▼]  [Last 6 Months ▼] │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Booking Run: Feb 21, 2026 at 12:01 AM                     │  │
│  │  Status: Completed | Duration: 4m 23s                      │  │
│  │  Results: 6 Booked | 2 Waitlisted | 0 Failed              │  │
│  │                                                             │  │
│  │  [▼ View Details]                                           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  ✅  Barry's Full Body - Feb 25, 6:00 AM                   │  │
│  │      Successfully booked in 1.2s                            │  │
│  │      Barry's Lincoln Park | Sarah Johnson                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  ✅  SLT Megaformer - Feb 26, 6:00 AM                      │  │
│  │      Successfully booked in 2.1s                            │  │
│  │      SLT Loop | Mike Chen                                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  ⏳  Y7 Hot Yoga - Feb 27, 6:30 AM                         │  │
│  │      Added to waitlist - class was full                     │  │
│  │      Y7 West Loop | Any instructor                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ... more results                                                 │
│                                                                    │
│  [Load More]                                                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 3.6 Email Summary

```
┌────────────────────────────────────────────────────────────┐
│  From: FitBook Auto <noreply@fitbookauto.com>             │
│  Subject: Your Fitness Classes Are Booked! 💪              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Hi there! 👋                                             │
│                                                            │
│  Your monthly fitness classes have been automatically      │
│  booked. Here's your summary:                             │
│                                                            │
│  ═══════════════════════════════════════════════════       │
│  ✅ SUCCESSFULLY BOOKED (6 classes)                        │
│  ═══════════════════════════════════════════════════       │
│                                                            │
│  📅 Feb 25 at 6:00 AM                                     │
│     Barry's Full Body                                      │
│     Barry's Lincoln Park - Sarah Johnson                   │
│                                                            │
│  📅 Feb 26 at 6:00 AM                                     │
│     SLT Megaformer                                         │
│     SLT Loop - Mike Chen                                   │
│                                                            │
│  📅 Feb 28 at 7:00 AM                                     │
│     ClassPass Spin                                         │
│     CycleBar Lincoln Park - Jessica Lee                    │
│                                                            │
│  ... and 3 more classes                                    │
│                                                            │
│  ═══════════════════════════════════════════════════       │
│  ⏳ WAITLISTED (2 classes)                                 │
│  ═══════════════════════════════════════════════════       │
│                                                            │
│  📅 Feb 27 at 6:30 AM                                     │
│     Y7 Hot Yoga                                            │
│     Y7 West Loop                                           │
│     Status: You're #3 on the waitlist                      │
│                                                            │
│  📅 Mar 1 at 9:00 AM                                      │
│     Barry's Arms & Abs                                     │
│     Barry's Gold Coast                                     │
│     Status: You're #5 on the waitlist                      │
│                                                            │
│  ═══════════════════════════════════════════════════       │
│                                                            │
│  📊 Overall Success Rate: 75% (6/8)                        │
│                                                            │
│  💡 Next Steps:                                            │
│  • Check your platform apps for confirmation emails        │
│  • Waitlisted classes may open up - we'll notify you       │
│  • View full details in your dashboard                     │
│                                                            │
│  [View Dashboard →]                                        │
│                                                            │
│  Questions? Reply to this email!                           │
│                                                            │
│  Happy sweating! 💪                                        │
│  - The FitBook Auto Team                                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Component Library

### 4.1 Core Components

**Button**
```tsx
<Button variant="primary" size="medium">
  Configure Classes
</Button>

Variants: primary, secondary, outline, ghost, danger
Sizes: small, medium, large
```

**Card**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Next Booking Run</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Badge**
```tsx
<Badge variant="success">Booked</Badge>
<Badge variant="warning">Waitlisted</Badge>
<Badge variant="error">Failed</Badge>

Variants: default, success, warning, error, info
```

**Input**
```tsx
<Input
  type="text"
  placeholder="Enter studio name"
  error="Studio name is required"
/>
```

**Select**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select platform" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="classpass">ClassPass</SelectItem>
    <SelectItem value="mindbody">Mindbody</SelectItem>
  </SelectContent>
</Select>
```

**Modal/Dialog**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Class Preference</DialogTitle>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Cancel</Button>
      <Button variant="primary">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 4.2 Custom Components

**PlatformIcon**
- Displays logo for each platform
- Props: platform (classpass | mindbody | barrys | slt | y7)

**StatusBadge**
- Visual indicator for booking status
- Props: status (booked | waitlisted | failed)
- Colors: Green, Yellow, Red

**CalendarCell**
- Custom calendar day cell with booking indicators
- Shows time and platform icon

**BookingCard**
- Displays booking details in history view
- Expandable for more info

---

## 5. Color Palette

### Primary Colors

```
Primary (Brand)
#6366F1 (Indigo 500) - Main brand color
#4F46E5 (Indigo 600) - Hover states
#4338CA (Indigo 700) - Active states

Secondary
#10B981 (Emerald 500) - Success states
#F59E0B (Amber 500) - Warning states
#EF4444 (Red 500) - Error states
```

### Neutral Colors

```
Background
#FFFFFF (White) - Main background
#F9FAFB (Gray 50) - Subtle background
#F3F4F6 (Gray 100) - Card backgrounds

Text
#111827 (Gray 900) - Primary text
#6B7280 (Gray 500) - Secondary text
#9CA3AF (Gray 400) - Muted text

Borders
#E5E7EB (Gray 200) - Default borders
#D1D5DB (Gray 300) - Hover borders
```

### Platform-Specific Colors

```
ClassPass: #1E40AF (Blue)
Mindbody: #7C3AED (Purple)
Barry's: #DC2626 (Red)
SLT: #000000 (Black)
Y7: #F97316 (Orange)
```

---

## 6. Typography

### Font Family

```
Primary: Inter (Google Fonts)
Monospace: JetBrains Mono (for code/tech details)
```

### Font Scales

```
Heading 1: 36px / 2.25rem (font-bold)
Heading 2: 30px / 1.875rem (font-bold)
Heading 3: 24px / 1.5rem (font-semibold)
Heading 4: 20px / 1.25rem (font-semibold)

Body Large: 18px / 1.125rem (font-normal)
Body: 16px / 1rem (font-normal)
Body Small: 14px / 0.875rem (font-normal)

Caption: 12px / 0.75rem (font-normal)
```

---

## 7. Responsive Design

### Breakpoints

```
Mobile: 0px - 639px
Tablet: 640px - 1023px
Desktop: 1024px+
Large Desktop: 1280px+
```

### Responsive Behavior

**Mobile (< 640px)**
- Single column layout
- Stacked navigation (hamburger menu)
- Full-width cards
- Simplified calendar view (week view)
- Bottom action bar for primary CTAs

**Tablet (640px - 1023px)**
- Two-column layout where appropriate
- Collapsible sidebar
- Grid view for cards (2 columns)
- Month calendar view with simplified details

**Desktop (1024px+)**
- Full multi-column layout
- Persistent sidebar navigation
- Grid view for cards (3-4 columns)
- Full calendar view with all details
- Hover states and tooltips

### Mobile-First Approach

All components designed mobile-first, progressively enhanced for larger screens.

---

## Design System Tools

- **UI Library**: shadcn/ui (built on Radix UI primitives)
- **Icons**: Lucide React
- **Calendar**: FullCalendar or react-big-calendar
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS

---

## Accessibility

### WCAG 2.1 AA Compliance

- Color contrast ratio minimum 4.5:1
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on all interactive elements
- ARIA labels where needed
- Semantic HTML

### Keyboard Shortcuts

```
/ - Focus search/filter
n - New booking preference
c - Go to calendar
h - Go to history
? - Show keyboard shortcuts
Esc - Close modal/dialog
```

---

## Animation Principles

### Micro-interactions

- Button hover: Scale 1.02, 150ms ease
- Card hover: Lift shadow, 200ms ease
- Loading states: Skeleton screens
- Success states: Confetti or checkmark animation
- Page transitions: Fade + slide, 300ms ease

### Performance

- Use CSS transforms (not margin/padding)
- Limit simultaneous animations
- Reduce motion for users with `prefers-reduced-motion`

---

## Next Steps

1. Create high-fidelity mockups in Figma
2. Build component library in Storybook
3. User testing with 5-10 fitness enthusiasts
4. Iterate based on feedback
5. Develop responsive prototypes

---

This design system provides a solid foundation for building a clean, modern, and user-friendly interface for FitBook Auto.
