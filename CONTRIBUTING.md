# Contributing to FitBook Auto

First off, thank you for considering contributing to FitBook Auto! It's people like you that make this tool better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding a New Platform](#adding-a-new-platform)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the proposed enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues perfect for beginners
- `help wanted` - Issues where we need community help
- `documentation` - Improvements to documentation

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Commit your changes (following our commit message guidelines)
7. Push to your branch
8. Open a Pull Request

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Git
- (Optional) Docker for local database

### Initial Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/your-username/fitness-autobooker.git
cd fitness-autobooker
```

2. **Install dependencies**

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. **Set up environment variables**

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your local configuration
```

4. **Set up database** (Supabase or local PostgreSQL)

```bash
# Run migrations
npm run db:migrate
```

5. **Run in development mode**

```bash
# Frontend (in frontend directory)
npm run dev

# Backend (in backend directory, separate terminal)
npm run dev
```

Frontend will be available at `http://localhost:3000`
Backend API at `http://localhost:3001`

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types - use specific types or `unknown`
- Use interfaces for object shapes
- Use enums for constants with limited options

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Best Practices

1. **Function/Variable Naming**
   - Use camelCase for variables and functions
   - Use PascalCase for classes and components
   - Use descriptive names

```typescript
// Good
const fetchUserPreferences = async (userId: string) => { ... }

// Bad
const fetchData = async (id: string) => { ... }
```

2. **Comments**
   - Write self-documenting code when possible
   - Add comments for complex logic
   - Use JSDoc for public functions

```typescript
/**
 * Books a fitness class using browser automation
 * @param preference - User's booking preference
 * @returns Booking result with status
 */
async function bookClass(preference: BookingPreference): Promise<BookingResult> {
  // Implementation
}
```

3. **Error Handling**
   - Always handle errors gracefully
   - Use custom error classes
   - Log errors with context

```typescript
try {
  await bookClass(preference);
} catch (error) {
  if (error instanceof AutomationError) {
    logger.error('Automation failed', { platform, error });
    // Handle automation-specific error
  } else {
    throw error; // Re-throw unexpected errors
  }
}
```

4. **Testing**
   - Write tests for new features
   - Maintain >80% code coverage
   - Use descriptive test names

```typescript
describe('BookingEngine', () => {
  it('should book class successfully when available', async () => {
    // Test implementation
  });

  it('should join waitlist when class is full', async () => {
    // Test implementation
  });
});
```

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(calendar): add drag-and-drop for booking preferences

Implemented drag-and-drop functionality in the calendar view to allow
users to easily reorder their booking preferences by priority.

Closes #123
```

```
fix(automation): handle ClassPass login timeout

Added retry logic with exponential backoff for ClassPass login
to handle intermittent network issues.

Fixes #456
```

```
docs(api): update authentication examples

Added code examples for JavaScript and Python SDK usage.
```

### Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Don't capitalize first letter
- No period at the end of subject line
- Limit subject line to 50 characters
- Separate subject from body with blank line
- Wrap body at 72 characters
- Use body to explain what and why, not how

---

## Pull Request Process

### Before Submitting

1. **Update documentation** if you've made changes to:
   - API endpoints
   - Configuration options
   - User-facing features

2. **Run tests** and ensure they all pass:

```bash
npm test
npm run type-check
npm run lint
```

3. **Update CHANGELOG.md** with your changes under "Unreleased" section

4. **Ensure your branch is up-to-date** with main:

```bash
git checkout main
git pull upstream main
git checkout your-branch
git rebase main
```

### PR Title

Use the same format as commit messages:

```
feat(platform): add Equinox platform support
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged

## Screenshots (if applicable)
Add screenshots to demonstrate the changes.
```

### Review Process

1. At least one maintainer must review and approve
2. All automated checks must pass
3. No unresolved conversations
4. Branch must be up-to-date with main

### After Merge

- Delete your feature branch
- Pull the latest main branch
- Start a new branch for your next contribution

---

## Adding a New Platform

Adding support for a new fitness platform? Great! Follow these steps:

### 1. Create Platform Automation Class

Create a new file: `backend/src/automation/platforms/YourPlatformAutomation.ts`

```typescript
import { BasePlatform, BookingResult, BookingPreference } from './BasePlatform';
import { Page } from 'puppeteer';

export class YourPlatformAutomation extends BasePlatform {
  constructor(page: Page) {
    super(page, 'yourplatform');
  }

  async login(username: string, password: string): Promise<void> {
    // Implement login logic
  }

  async navigateToSchedule(date: Date): Promise<void> {
    // Implement navigation to schedule
  }

  async findClass(preference: BookingPreference): Promise<boolean> {
    // Implement class finding logic
  }

  async bookClass(): Promise<BookingResult> {
    // Implement booking logic
  }

  async joinWaitlist(): Promise<BookingResult> {
    // Implement waitlist logic
  }
}
```

### 2. Add Platform to Types

Update `backend/src/types/platform.ts`:

```typescript
export type Platform =
  | 'classpass'
  | 'mindbody'
  | 'barrys'
  | 'slt'
  | 'y7'
  | 'yourplatform'; // Add here
```

### 3. Register Platform in Engine

Update `backend/src/automation/core/BookingEngine.ts`:

```typescript
import { YourPlatformAutomation } from '../platforms/YourPlatformAutomation';

// In getPlatformAutomation method
case 'yourplatform':
  return new YourPlatformAutomation(page);
```

### 4. Add Tests

Create `backend/tests/platforms/yourplatform.test.ts`:

```typescript
describe('YourPlatformAutomation', () => {
  it('should login successfully', async () => {
    // Test implementation
  });

  // More tests...
});
```

### 5. Update Documentation

- Add platform to README.md features list
- Add platform to API documentation
- Add any platform-specific notes

### 6. Submit PR

Follow the normal PR process with:
- Screenshots/videos of the automation working
- Test results
- Any platform-specific configuration needed

---

## Questions?

Feel free to:
- Open a GitHub Discussion
- Tag maintainers in issues
- Reach out via email (see README)

---

**Thank you for contributing!** 🎉
