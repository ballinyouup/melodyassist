/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(0%)'},
          '100%': { transform: 'translateX(100%)'},
        }
      },
      animation: {
        slideLeft: 'slideLeft 1s',
        slideRight: 'slideRight 1s',
      }
    },
  },
  // add daisyUI plugin
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "night",
  },
}


module.exports = config;