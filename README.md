# React + Vite + AI Studio

This project combines a React app built with Vite and an AI Studio interface for managing and deploying your app.

## Features

- **React + Vite**: A minimal setup for React with Vite, including HMR and ESLint rules.
- **AI Studio Integration**: Provides an interface for managing user authentication and backend interactions.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
3. Run the app:
   ```bash
   npm run dev
   ```

## Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Uses [SWC](https://swc.rs/) for Fast Refresh.
