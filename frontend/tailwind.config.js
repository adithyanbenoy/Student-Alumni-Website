/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          800: '#006837', // SRM Easwari Primary Green
          900: '#14532d',
        },
        accent: {
          500: '#f59e0b',
          600: '#d97706',
          gold: '#FDB913', // SRM Easwari Crest Gold
        },
        navy: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0A66C2', // LinkedIn Blue
          700: '#0369a1',
          800: '#075985',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
