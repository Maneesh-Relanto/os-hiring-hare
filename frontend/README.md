# Hiring Hare - Frontend

React + TypeScript + Vite frontend for Hiring Hare recruitment tracking system.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

3. **Run development server:**
```bash
npm run dev
```

4. **Access application:**
- http://localhost:3000

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API client and endpoints
│   ├── components/     # React components
│   │   ├── common/    # Reusable components
│   │   └── layout/    # Layout components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── stores/         # Zustand stores
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── routes/         # Route definitions
│   ├── styles/         # Global styles & theme
│   ├── assets/         # Images, icons, etc.
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── README.md          # This file
```

## 🎨 Design System

The project uses a vibrant, modern design system based on Material-UI with custom theme:

- **Primary Color:** Purple gradient (#A855F7 to #EC4899)
- **Secondary Color:** Teal (#22D3EE)
- **Typography:** Inter + Poppins fonts
- **Components:** Custom styled MUI components
- **Animations:** Smooth transitions and micro-interactions

See [design/ui-design-system.md](../design/ui-design-system.md) for complete guidelines.

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Code Style

- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type safety

Run `npm run format` before committing.

## 🧪 Testing

```bash
# Run tests (to be added)
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_APP_NAME=Hiring Hare
VITE_APP_VERSION=0.1.0
VITE_ENVIRONMENT=development
```

### Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

```typescript
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/models';
```

## 📚 Key Libraries

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **React Query** - Data fetching
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Toastify** - Notifications

## 🎯 Features to Implement

- [ ] Authentication pages (Login, Register)
- [ ] Dashboard with stats cards
- [ ] Requirement management
- [ ] Approval workflow UI
- [ ] Candidate management
- [ ] Interview scheduling
- [ ] Reporting and analytics

## 🐛 Debugging

### Using VS Code

1. Install "Debugger for Chrome" extension
2. Press F5 to start debugging
3. Set breakpoints in your code

### Browser DevTools

- React DevTools for component inspection
- Redux DevTools for state management
- Network tab for API calls

## 🚢 Deployment

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to hosting service
# (Vercel, Netlify, etc.)
```

Build output will be in `dist/` directory.

## 📄 License

Proprietary - All rights reserved
