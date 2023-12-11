/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
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
  plugins: [],
};
