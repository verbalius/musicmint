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
          500: "#2561ED",
        },
      },
    },
  },
  plugins: [],
};
