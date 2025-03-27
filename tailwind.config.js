/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{html,js,ts,vue}'],
  darkMode: ['selector', '.dark'],
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#f7fafc',
        },
      },
    },
  },
  plugins: [],
};
