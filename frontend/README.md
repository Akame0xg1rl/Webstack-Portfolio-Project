# Vite Project Guide 🚀

## Project Structure
```
project-root/
├── src/                  # Source files
├── public/              # Static assets
├── dist/                # Build output
├── node_modules/        # Dependencies
├── index.html          # Entry point
├── package.json        # Project configuration
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── components.json     # Components configuration
```

## Setup and Installation

### Create a New Vite Project
```bash
npm create vite@latest my-project
cd my-project
```

### Install Dependencies
```bash
npm install
```

## Development Commands

### Start Development Server
```bash
npm run dev
```
- Launches development server
- Default port: 5173
- Hot Module Replacement (HMR) enabled

### Build for Production
```bash
npm run build
```
- Outputs to `dist` directory
- Optimized and minified assets

### Preview Production Build
```bash
npm run preview
```
- Preview the built project locally

## Key Configuration Files

### vite.config.js
```javascript
export default {
  // Your Vite configuration options
  plugins: [],
  server: {
    port: 5173
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Additional Features

### Environment Variables
- Create `.env` files for environment variables
- Access using `import.meta.env.VITE_*`

### Static Asset Handling
- Place in `public/` directory
- Reference from root path in code

### Hot Module Replacement
- Automatically enabled
- Preserves state during development
- Fast refresh for React components

## Tips for Optimal Usage
- Keep `node_modules` in `.gitignore`
- Use `vercel.json` for deployment configuration
- Configure ESLint with `.eslintrc.cjs`
- Utilize `jsconfig.json` for TypeScript/JavaScript configuration