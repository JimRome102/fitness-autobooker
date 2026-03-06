# FitBook Auto - Frontend

This is the frontend web application for FitBook Auto.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` with your API URL

4. Run in development mode:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run type-check` - Type check without emitting
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── calendar/            # Calendar-specific components
│   ├── credentials/         # Credential management components
│   └── layout/              # Layout components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
└── styles/                  # Global styles
```

## Design System

See [/docs/design/MOCKUPS.md](../docs/design/MOCKUPS.md) for UI/UX documentation.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
