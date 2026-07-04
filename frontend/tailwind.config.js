/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        command: "#030405",
        panel: "#090A0D",
        cyanx: "#51E7FF",
        bluex: "#4A8DFF",
        greenx: "#48E6A4",
        amberx: "#FFBF5F",
        redx: "#FF5F6D"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Source Serif 4"', "ui-serif", "Georgia", "serif"]
      },
      boxShadow: {
        glow: "0 0 55px rgba(81, 231, 255, 0.14)",
        panel: "0 34px 120px rgba(0, 0, 0, 0.72)"
      },
      borderRadius: {
        command: "18px"
      }
    }
  },
  plugins: []
};
