# Project Information

## Project Name
**Scan Scribe Visor** - A React-based web application

## Project Overview
This is a modern React application built with TypeScript, Vite, and shadcn-ui components. It appears to be a medical/healthcare application with features for EMR (Electronic Medical Records) viewing, printing, and administrative tools.

## Technology Stack

### Core Technologies
- **React 18.3.1** - Frontend framework
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 5.4.19** - Build tool and development server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### UI Components
- **shadcn-ui** - Modern UI component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Additional Libraries
- **React Router DOM** - Client-side routing
- **React Query (TanStack Query)** - Data fetching
- **Recharts** - Chart components
- **Date-fns** - Date utilities
- **Sonner** - Toast notifications

## Prerequisites

### Required Node.js Version
- **Node.js 18+** (Recommended: 18.20.8 or higher)
- **npm 8+** (Comes with Node.js 18)

### Check Your Node.js Version
```bash
node --version
npm --version
```

### If You Need to Update Node.js
```bash
# Using nvm (Node Version Manager)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd scan-scribe-visor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:8091/
- **Network**: http://192.168.0.109:8091/ (or your local IP)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8091 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

## Project Structure

```
scan-scribe-visor/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components
│   │   ├── modules/       # Main application modules
│   │   └── ui/           # shadcn-ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## Key Features

### Authentication
- Login screen component (`LoginScreen.tsx`)

### Main Interface
- Main layout component (`MainInterface.tsx`)

### Application Modules
- **Admin Tools** (`AdminTools.tsx`) - Administrative functionality
- **EMR Viewer** (`EMRViewer.tsx`) - Electronic Medical Records viewing
- **EMR Print** (`EMRPrint.tsx`) - EMR printing functionality

### UI Components
- Comprehensive set of shadcn-ui components
- Responsive design with mobile support
- Modern, accessible UI components

## Development Notes

### Port Configuration
The development server runs on **port 8091** (configured in `vite.config.ts`)

### Hot Reload
Vite provides instant hot module replacement (HMR) for fast development

### TypeScript
Full TypeScript support with strict type checking

### ESLint
Code quality enforced with ESLint configuration

## Troubleshooting

### Common Issues

1. **Node.js Version Too Old**
   - Error: `SyntaxError: Unexpected reserved word`
   - Solution: Update to Node.js 18+

2. **Rollup Module Error**
   - Error: `Cannot find module @rollup/rollup-darwin-arm64`
   - Solution: Delete `node_modules` and `package-lock.json`, then run `npm install`

3. **Port Already in Use**
   - Change port in `vite.config.ts` or kill the process using the port

### Reset Installation
If you encounter dependency issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Contributing

1. Ensure you're using Node.js 18+
2. Install dependencies with `npm install`
3. Start development server with `npm run dev`
4. Make your changes
5. Run linting with `npm run lint`
6. Test your changes thoroughly

## API Integration

### Backend API
- **API URL**: http://localhost:8085
- **Authentication**: Login endpoint at `/Login`
- **Response Format**: JSON

### API Endpoints

#### Login
- **Endpoint**: `POST /Login`
- **Request Body**:
  ```json
  {
    "userID": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "userName": "string",
    "userID": "string"
  }
  ```

### API Service
The project includes an API service (`src/lib/api.ts`) that handles:
- HTTP requests to the backend
- Type-safe API calls
- Error handling
- Authentication

### Session Management
The application includes a comprehensive session management system:

- **Persistent Sessions**: User sessions are stored in localStorage and persist across browser refreshes
- **Session Timeout**: Sessions automatically expire after 24 hours
- **Session Duration**: Real-time display of how long the user has been logged in
- **Auto-login**: Users are automatically logged in if they have a valid session

### Session Features
- **Automatic Session Check**: App checks for existing sessions on startup
- **Session Expiration**: Sessions expire after 24 hours for security
- **Session Duration Tracking**: Shows how long user has been logged in
- **Secure Logout**: Properly clears all session data
- **Inactivity Tracking**: Auto-logout after 5 minutes of inactivity
- **Activity Monitoring**: Tracks mouse, keyboard, scroll, and touch events
- **Inactivity Warning**: 30-second countdown warning before auto-logout
- **Stay Active Option**: Users can extend their session during warning

---

**Last Updated**: September 2024
**Node.js Version**: 18.20.8
**Port**: 8091
