/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f6f0e2',
          100: '#fbf8f1',
          200: '#f6f0e2',
          300: '#ece1c9',
        },
        espresso: {
          950: '#1c110a',
          900: '#2a1a10',
          800: '#3d2717',
          700: '#523422',
          600: '#6b4630',
        },
        terracotta: {
          DEFAULT: '#bd5b34',
          400: '#d9855f',
          300: '#e7ab8c',
        },
        crema: '#e3a94a',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
