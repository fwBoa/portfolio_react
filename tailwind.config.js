/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OS Teal — Normal Face (ancienne palette bleue sarcelle)
        'os-bg': '#ffffff',
        'os-surface': '#f0f5f5',
        'os-border': '#d0e0e0',
        'os-text': '#2d6b6b',
        'os-muted': '#6b9e9e',
        // Dev Face — Terminal (only green on the site)
        'dev-bg': '#0a0a0a',
        'dev-surface': '#111111',
        'dev-border': '#222222',
        'dev-text': '#e5e5e5',
        'dev-muted': '#666666',
        'dev-green': '#00ff41',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'Monaco', 'Courier New', 'monospace'],
        'display': ['"Syne"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
