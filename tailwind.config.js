/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // タッチ端末でhoverスタイルが「張り付く」のを防ぐ（hover対応デバイスのみ適用）
  future: { hoverOnlyWhenSupported: true },
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
        accent: { DEFAULT: "#E8131D", soft: "#FBE7E8", deep: "#B90E16" },
        // ink面の深色（ヒーロー・グラデーション用）
        night: { DEFAULT: "#081729", soft: "#12294A" },
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
        hero: "0 24px 64px rgba(8,23,41,0.28)",
      },
      maxWidth: { content: "1120px" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.6s ease both",
      },
    },
  },
  plugins: [],
};
