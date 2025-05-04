/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundColor: {
        'primary': '#00a8ff',
        'secondary': '#9d4edd',
        'accent': '#00f5d4',
      },
      textColor: {
        'primary': '#00a8ff',
        'secondary': '#9d4edd',
        'accent': '#00f5d4',
      },
      gradientColorStops: {
        'primary': '#00a8ff',
        'secondary': '#9d4edd',
        'accent': '#00f5d4',
      },
    },
  },
  plugins: [],
};