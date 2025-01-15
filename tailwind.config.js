/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mainBackgroundColor": '#f5f7fa',
        "columnBackgroundColor": '#e3eaf0',
        "taskBackgroundColor": '#ffffff',
        "accentColor": '#4a90e2',
        "scrollbarColor": '#cbd5e0',
        "taskScrollbarThumb": '#76c7f0',
        "buttonBackground": '#d4e8ff',
        "textColor": '#333333'
      }
    },
  },
  plugins: [],
}

