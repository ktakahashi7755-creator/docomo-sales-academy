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
import { Quiz } from "@/pages/Quiz";
import { SvDashboard } from "@/pages/sv/SvDashboard";
import { SvTraineeDetail } from "@/pages/sv/SvTraineeDetail";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminOverview } from "@/pages/admin/AdminOverview";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminProductEdit } from "@/pages/admin/AdminProductEdit";
import { AdminAnnouncements } from "@/pages/admin/AdminAnnouncements";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminAudit } from "@/pages/admin/AdminAudit";

function AuthGate({ children }: { children: ReactNode }) {
  const { loading } = useAuth();
  // セッション解決中はリダイレクトせず loading を見せる（ログイン直後のバウンス防止）。
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-content px-4 py-6 md:px-8 md:py-8">
        <PageLoading />
      </div>
    );
  }
  return <>{children}</>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  return <AuthGate>{!profile ? <Navigate to="/login" replace /> : <>{children}</>}</AuthGate>;
}

/** SV ガード：sv / admin 以外はダッシュボードへ戻す（UI 側の防御。読取/承認は RLS でも遮断）。 */
function RequireSv({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  return (
    <AuthGate>
      {!profile ? (
        <Navigate to="/login" replace />
      ) : profile.role !== "sv" && profile.role !== "admin" ? (
        <Navigate to="/" replace />
      ) : (
        <>{children}</>
      )}
    </AuthGate>
  );
}

/** 管理画面ガード：admin 以外はダッシュボードへ戻す（UI 側の防御。書込は RLS でも遮断）。 */
function RequireAdmin({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  return (
    <AuthGate>
      {!profile ? (
        <Navigate to="/login" replace />
      ) : profile.role !== "admin" ? (
        <Navigate to="/" replace />
      ) : (
        <>{children}</>
      )}
    </AuthGate>
  );
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
        <Route path="quiz/:moduleId" element={<Quiz />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="scripts" element={<TalkScripts />} />
        <Route path="scripts/:id" element={<TalkScriptDetail />} />
        <Route path="roleplay" element={<Roleplay />} />
        <Route path="certification" element={<Certification />} />
        <Route
          path="sv"
          element={
            <RequireSv>
              <SvDashboard />
            </RequireSv>
          }
        />
        <Route
          path="sv/:traineeId"
          element={
            <RequireSv>
              <SvTraineeDetail />
            </RequireSv>
          }
        />
      </Route>
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/:id" element={<AdminProductEdit />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="audit" element={<AdminAudit />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
