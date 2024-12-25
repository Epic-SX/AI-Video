/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'], // Add Noto Sans JP to the sans font stack
      },
      keyframes: {
        spinner: {
          "0%, 100%": { transform: "rotate(var(--rotation)) translateY(0)" },
          "50%": { transform: "rotate(var(--rotation)) translateY(300%)" },
        },
        rotateSpinner: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        spinner: "spinner 1.25s infinite ease",
        rotateSpinner: "rotateSpinner 1s infinite linear",
      },
    },
  },
  plugins: [],
};