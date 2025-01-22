/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(108.18deg, #201606 2.46%, #000000 99.84%)",
      },
    },
  },
  plugins: [],
};
