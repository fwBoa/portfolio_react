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
        // Corps de texte lisible : 4.99:1 sur blanc (WCAG AA)
        // os-muted (3.00:1) reste réservé aux éléments décoratifs et aux états secondaires
        'os-body': '#457878',
        // Corps de texte des articles : 7.37:1 sur blanc (WCAG AAA).
        // Sur 2 000 mots, le confort prime — volontairement plus sombre que
        // les titres (os-text, 6.13:1).
        'os-reading': '#275e5e',
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
