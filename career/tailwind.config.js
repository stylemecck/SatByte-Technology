/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // SatByte Blue
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
        accent: {
          DEFAULT: '#00D1FF', // Cyan accent
        },
        secondary: {
          DEFAULT: '#0f172a', // Slate-900
          light: '#1e293b',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
