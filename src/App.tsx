import { BrowserRouter } from "react-router-dom";
import { ProvideProvider, useProvide } from "@/growth/context/ProvideContext";
import { Entry } from "@/growth/pages/Entry";
import { AppRoutes } from "@/router";

// サブパス配信（GitHub Pages 等）でも動くよう Vite の base を basename に渡す。
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

// 未入室なら入室画面、入室済みなら本体。役割選択は置かないシンプルなゲート。
function Gate() {
  const { entered } = useProvide();
  if (!entered) return <Entry />;
  return (
    <BrowserRouter
      basename={basename}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppRoutes />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ProvideProvider>
      <Gate />
    </ProvideProvider>
  );
}
