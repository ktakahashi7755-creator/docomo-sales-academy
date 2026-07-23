/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 構造色：深いネイビー
        ink: {
          DEFAULT: "#0B1F3A",
          soft: "#33425A",
          muted: "#6B7688",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F8FA",
          line: "#E7EAF0",
        },
        // ドコモ想起の赤（アクセント最小限）
        accent: { DEFAULT: "#E8131D", soft: "#FBE7E8" },
        // dカード GOLD / PLATINUM
        gold: { DEFAULT: "#B8893C", soft: "#F6EFE0", deep: "#8C6726" },
        platinum: { DEFAULT: "#737B88", soft: "#EEF0F3", deep: "#4C535E" },
        // 状態色
        pass: { DEFAULT: "#1F8A53", soft: "#E5F3EB" },
        caution: { DEFAULT: "#C98A00", soft: "#FBF1DA" },
        fail: { DEFAULT: "#C0392B", soft: "#FBE9E7" },
      },
      fontFamily: {
        display: ["Poppins", "Noto Sans JP", "system-ui", "sans-serif"],
        sans: ["Noto Sans JP", "Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.125rem" },
      boxShadow: {
        card: "0 1px 2px rgba(11,31,58,0.04), 0 8px 24px rgba(11,31,58,0.06)",
        lift: "0 2px 4px rgba(11,31,58,0.06), 0 16px 40px rgba(11,31,58,0.10)",
      },
      maxWidth: { content: "1120px" },
    },
  },
  plugins: [],
};
