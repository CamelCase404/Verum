/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        divider: "var(--divider)",
        accent: "var(--accent)",
        accentSoft: "var(--accent-soft)",
        page: "var(--page)",
      },
      borderRadius: {
        xl2: "22px", // ВОЗВРАЩАЕМ ВАШИ ЗАКРУГЛЕНИЯ
      }
    },
  },
  plugins: [],
};
