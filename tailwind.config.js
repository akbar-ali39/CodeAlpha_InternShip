/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}",
    "./Ecommerce/**/*.{js,jsx,ts,tsx}",
    "./PersonalFinanceTracker/**/*.{js,jsx,ts,tsx}",
    "./TruthORDare/**/*.{js,jsx,ts,tsx}",
    "./MovieApp/**/*.{js,jsx,ts,tsx}",
    "./Random_Quote_Generator/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       colors: {
        primary: "#c3e703"
       }
    },
  },
  plugins: [],
}