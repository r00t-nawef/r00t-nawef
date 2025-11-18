/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald-green': '#006C3B',
        'mountain-meadow': '#2CC295',
        'dark-green': '#032221',
        'anti-flash-white': '#F1F7F6',
        'rich-black': '#000F11',
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
