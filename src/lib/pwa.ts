/**
 * PWA：本番ビルドでのみ Service Worker を登録する。
 * dev / テスト（jsdom）では何もしない（import.meta.env.PROD=false）。
 * scope は Vite の base に合わせる（ルート "/" でも GitHub Pages のサブパスでも動く）。
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD) return;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const base = import.meta.env.BASE_URL;
  const register = () => {
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
      // 登録失敗は致命的でない（オフライン強化のみ）。通常の利用には影響しない。
    });
  };
  // load 済みなら即登録、未了なら load を待つ（実行タイミングに依らず確実に登録する）。
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
