/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'Helvetica', 'Arial', 'sans-serif'],
      },
      lineHeight: {
        default: 1.5,
      },
      colors: {
        primary: 'rgba(255, 255, 255, 0.87)',
        background: '#242424',
      },
      borderColor: {
        custom: '#646cff',
      },
      // extra
    },
  },
  variants: {
    extend: {
      borderColor: ['hover'],
    },
  },
  plugins: [],
};
