/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        page: "var(--bg)", // ИСПРАВЛЕНО: теперь фон страницы совпадает с главным сайтом
        card: "var(--surface)", // ИСПРАВЛЕНО: блоки теперь светлее фона
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        "ink-4": "var(--ink-4)",
        divider: "var(--line)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        "accent-3": "var(--accent-3)",
        "accent-soft": "var(--accent-soft)",
        "accent-soft/50": "var(--accent-soft)",
        "accent-line": "var(--accent-line)",
        warn: "var(--warn)",
        "warn-soft": "var(--warn-soft)",
        amber: "var(--amber)",
        "amber-soft": "var(--amber-soft)",
      },
    },
  },
  plugins: [],
};
