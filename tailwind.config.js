/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xss: "418px",
      xs: "512px",
      sm: "618px",
      md: "768px",
      lg: "902px",
      lgg: "1093px",
      xl: "1440px",
    },

    extend: {
      fontFamily: {
        hind: ["Hind", "sans-serif"],
        int: ["Inter", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        pop: ["Poppins", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
      },
      backgroundColor: {
        dark: "#191917",
        backGround: "#242623",
        overlay: "#313330",
        overlayLight: "#4E4E4E",
        grn: "#52D858",
        light: "#B5B7B5",
        activeNav: "#313330",
        profile: "#5C534C",
      },
      textColor: {
        grn: "#52D858",
        dark: "#191917",

        light: "#B5B7B5",
        overlayLight: "#4E4E4E",
      },
      borderColor: { grn: "#52D858", light: "#B5B7B5" },
      accentColor: {
        grn: "#52D858",
      },
    },
  },
  plugins: [],
});
