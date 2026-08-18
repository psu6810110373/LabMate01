/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          bg: "#f4f4f4",
          surface: "#ffffff",
          low: "#f9f9f9",
          container: "#eeeeee",
          high: "#e8e8e8",
          text: "#1a1c1c",
          muted: "#43474e",
          outline: "#e2e8f0",
          primary: "#0c2b4e",
          primaryDark: "#001631",
          secondary: "#1a3d64",
          secondaryLight: "#406089",
          accent: "#1d546c",
        }
      },
      boxShadow: {
        'clinical': '0px 4px 20px rgba(12, 43, 78, 0.05)',
        'clinical-lg': '0px 8px 30px rgba(12, 43, 78, 0.08)',
        'clinical-inner': 'inset 0px 2px 4px rgba(12, 43, 78, 0.06)',
      },
      fontFamily: {
        display: ['Hanken Grotesk', 'Kanit', 'sans-serif'],
        sans: ['Inter', 'Kanit', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'element': '12px',
      }
    },
  },
  plugins: [],
}
