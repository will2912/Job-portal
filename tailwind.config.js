/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        destructive: "#ef4444", // red-500
        secondary: "#6b7280"    // gray-500
      }
    },
  },
  plugins: [],
}

