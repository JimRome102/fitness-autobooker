# FitBook Auto - Backend

This is the backend API and automation engine for FitBook Auto.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Browser Automation**: Puppeteer
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` with your credentials

4. Run in development mode:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run type-check` - Type check without emitting

## Project Structure

```
src/
├── index.ts                 # Entry point
├── app.ts                   # Express app configuration
├── controllers/             # Route controllers
├── services/                # Business logic
├── models/                  # Data models
├── middleware/              # Express middleware
├── automation/              # Browser automation
│   ├── core/                # Core automation engine
│   └── platforms/           # Platform-specific implementations
└── utils/                   # Utilities
```

## API Documentation

See [/docs/api/API.md](../docs/api/API.md) for complete API documentation.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
