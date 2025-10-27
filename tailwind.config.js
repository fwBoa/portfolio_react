/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dev-dark': '#0a0a0a',
        'dev-accent': '#00ff41',
        'minimal-bg': '#ffffff',      // ← Fond blanc (au lieu de '#f8f9fa')
        'minimal-text': '#376974',    // ← Votre nouvelle couleur (au lieu de '#2c3e50') 
      },
      fontFamily: {
        'mono': ['Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
