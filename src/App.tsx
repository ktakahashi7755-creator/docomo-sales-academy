import { BrowserRouter, HashRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AppRoutes } from "@/router";

// React Router v7の挙動へ先行オプトイン（移行警告の解消）
const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

// 静的ホスティング（GitHub Pages等）向けビルドでは VITE_HASH_ROUTER=1 でハッシュルーティングに切替
const Router = import.meta.env.VITE_HASH_ROUTER === "1" ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={ROUTER_FUTURE}>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
