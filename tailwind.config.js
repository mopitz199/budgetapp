/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto'],             // fuente base por defecto
        bold: ['Roboto_Bold'],             // fuente base por defecto
        light: ['Roboto_Light'],  // fuente para títulos
      },
      colors: {
        primary: "#0057FF",
        error: "#FF5A5F",
        success: "#00C48C",
        divider: "#E5E7EB",
        linkTextOverLight: "#0066FF",
        background: "#F3F4F6",
        surface: "#FFFFFF",
        surfaceVariant: "#FFFFFF",
        onPrimary: "#eeeeee", // color del texto en vista azul
        onSurface: "#1D2430",
        onSurfaceVariant: "#5C677D",

        darkMode: {
          primary: "#0057FF",
          error: "#FF5A5F",
          success: "#00C48C",
          divider: "#E5E7EB",
          linkTextOverLight: "#0066FF",
          background: "#1D2430",
          surface: "#2A3447",
          surfaceVariant: "#2A3447",
          onPrimary: "#eeeeee", // color del texto en vista azul
          onSurface: "#eeeeee",
          onSurfaceVariant: "#AAB3C2",
        }
      }
    },
  },
  //darkMode: "media", // o 'class' si lo manejás manualmente
  plugins: [],
}