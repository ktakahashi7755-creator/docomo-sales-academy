import { lazy, Suspense, type ReactNode } from "react";
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

// 役割限定で利用頻度の低い SV / 管理画面は遅延読込（初期バンドルから分離）。
const SvDashboard = lazy(() =>
  import("@/pages/sv/SvDashboard").then((m) => ({ default: m.SvDashboard })),
);
const SvTraineeDetail = lazy(() =>
  import("@/pages/sv/SvTraineeDetail").then((m) => ({ default: m.SvTraineeDetail })),
);
const AdminLayout = lazy(() =>
  import("@/pages/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const AdminOverview = lazy(() =>
  import("@/pages/admin/AdminOverview").then((m) => ({ default: m.AdminOverview })),
);
const AdminProducts = lazy(() =>
  import("@/pages/admin/AdminProducts").then((m) => ({ default: m.AdminProducts })),
);
const AdminProductEdit = lazy(() =>
  import("@/pages/admin/AdminProductEdit").then((m) => ({ default: m.AdminProductEdit })),
);
const AdminAnnouncements = lazy(() =>
  import("@/pages/admin/AdminAnnouncements").then((m) => ({ default: m.AdminAnnouncements })),
);
const AdminUsers = lazy(() =>
  import("@/pages/admin/AdminUsers").then((m) => ({ default: m.AdminUsers })),
);
const AdminAudit = lazy(() =>
  import("@/pages/admin/AdminAudit").then((m) => ({ default: m.AdminAudit })),
);

/** 遅延ページの Suspense 受け皿。 */
function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>;
}

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
              <Lazy>
                <SvDashboard />
              </Lazy>
            </RequireSv>
          }
        />
        <Route
          path="sv/:traineeId"
          element={
            <RequireSv>
              <Lazy>
                <SvTraineeDetail />
              </Lazy>
            </RequireSv>
          }
        />
      </Route>
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Lazy>
              <AdminLayout />
            </Lazy>
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
