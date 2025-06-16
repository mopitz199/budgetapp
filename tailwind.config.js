/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryTextOverColorOrDark: "#FFFFFF",
        primaryTextOverLight: "#1D2430",
        secondaryTextOverLight: "#5C677D",
        disableTextOverLight: "#9AA1B3",

        divider: "#E5E7EB",
        surfaceCard: "#FFFFFF",
        background: "#F9FAFB",

        linkTextOverLight: "#0066FF",

        primary: "#0057FF",
        success: "#00C48C",
        error: "#FF5A5F",
        warning: "#FFA928",
        accent: "#FF57D9",

        
        darkMode: {
          background: "#0E1116",
          primaryButton: "#4C8DFF",
          secondaryButton: "#30D9A3",
          warning: "#FFC44D",
          error: "#FF7A80",
          surface: "#1B1F24",
          textPrimary: "#EAECEE",
          textSecondary: "#9AA1B3",
          accent: "#FF8BF0",
        }
      }
    },
  },
  plugins: [],
}