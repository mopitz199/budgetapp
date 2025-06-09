/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "put my primary color here",
        secondary: "put my secondary color here",
        light: {
          100: "#32329d",
          200: "#32329d",
          300: "#32329d",
          600: "#32329d",
        }
      }
    },
  },
  plugins: [],
}