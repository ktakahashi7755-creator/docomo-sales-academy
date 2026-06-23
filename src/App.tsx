import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ContentProvider } from "@/context/ContentContext";
import { CertificationProvider } from "@/context/CertificationContext";
import { AppRoutes } from "@/router";

// サブパス配信（GitHub Pages 等）でもルーティングが効くよう、Vite の base を basename に渡す。
// 既定の "/" のときは "" となり、ルート配信・ローカル開発・テストに影響しない。
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <CertificationProvider>
          <BrowserRouter
            basename={basename}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <AppRoutes />
          </BrowserRouter>
        </CertificationProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
