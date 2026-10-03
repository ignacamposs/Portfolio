/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f5f4f0',
          100: '#fbfaf7',
          200: '#ecebe5',
        },
        ink: {
          DEFAULT: '#14140f',
          700: '#3a3a33',
          500: '#6b6b62',
          300: '#a3a299',
        },
        accent: {
          DEFAULT: '#2f45e8',
          600: '#2235c4',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
