import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** ルート遷移時にスクロール位置を先頭へ戻す（React Routerは自動で戻さない） */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
