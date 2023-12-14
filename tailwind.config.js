/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f3f7fb",
          100: "#e3eef6",
          200: "#cde2f0",
          300: "#abcee5",
          400: "#83b4d7",
          500: "#669acb",
          600: "#5382bd",
          700: "#4870ad",
          800: "#3f5d8e",
          900: "#374e71",
          950: "#253146",
        },
        categoryBlue: "#6298CA",
        categoryGreen: "#92C046",
        categoryTurquoise: "#62B7CA",
        categoryOrange: "#DE8989",
        categoryPurple: "#9062CA",
        categoryYellow: "#CAA062",
        categoryDarkGreen: "#62CAA5",
        categoryPink: "#CA62B3",
      },
    },
  },
  safelist: [
    //categories active sidebar gradient
    "bg-gradient-to-r  from-categoryBlue",
    "bg-gradient-to-r  from-categoryGreen",
    "bg-gradient-to-r  from-categoryTurquoise",
    "bg-gradient-to-r  from-categoryOrange",
    "bg-gradient-to-r  from-categoryPurple",
    "bg-gradient-to-r  from-categoryYellow",
    "bg-gradient-to-r  from-categoryDarkGreen",
    "bg-gradient-to-r  from-categoryPink",
  ],
  plugins: [],
};
