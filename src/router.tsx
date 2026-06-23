import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLoading } from "@/components/ui";
import { Layout } from "@/components/Layout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Roadmap } from "@/pages/Roadmap";
import { Products } from "@/pages/Products";
import { ProductDetail } from "@/pages/ProductDetail";
import { TalkScripts } from "@/pages/TalkScripts";
import { TalkScriptDetail } from "@/pages/TalkScriptDetail";
import { Roleplay } from "@/pages/Roleplay";
import { Certification } from "@/pages/Certification";

function RequireAuth({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  // セッション解決中はリダイレクトせず loading を見せる（ログイン直後のバウンス防止）。
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-content px-4 py-6 md:px-8 md:py-8">
        <PageLoading />
      </div>
    );
  }
  if (!profile) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="scripts" element={<TalkScripts />} />
        <Route path="scripts/:id" element={<TalkScriptDetail />} />
        <Route path="roleplay" element={<Roleplay />} />
        <Route path="certification" element={<Certification />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
