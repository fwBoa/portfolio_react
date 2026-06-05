/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OS Monochrome — Normal Face
        'os-bg': '#ffffff',
        'os-surface': '#f5f5f5',
        'os-border': '#e5e5e5',
        'os-text': '#000000',
        'os-muted': '#737373',
        // Dev Face — Terminal (only color on the site)
        'dev-bg': '#0a0a0a',
        'dev-surface': '#111111',
        'dev-border': '#222222',
        'dev-text': '#e5e5e5',
        'dev-muted': '#666666',
        'dev-green': '#00ff41',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
