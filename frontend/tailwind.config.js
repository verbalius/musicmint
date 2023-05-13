/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        "2.5xl": "18px",
      },
      colors: {
        information: {
          default: "#2561ED",
          400: "#598CF4",
          500: "#2561ED",
        },
        highlight: {
          default: "#0F1D40",
          500: "#0F1D40",
        },
        "dark-gray": {
          400: "#525C76",
          default: "#525C76",
        },
        outline: "#CACDD5",
        boxShadow: {
          "black-e3": "0px 4px 5px -1px rgba(0, 0, 0, 0.08);",
        },
      },
    },
  },
  plugins: [],
};
