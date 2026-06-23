import { BrowserRouter } from "react-router-dom";
import { ProvideProvider } from "@/growth/context/ProvideContext";
import { AppRoutes } from "@/router";

// サブパス配信（GitHub Pages 等）でも動くよう Vite の base を basename に渡す。
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <ProvideProvider>
      <BrowserRouter
        basename={basename}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppRoutes />
      </BrowserRouter>
    </ProvideProvider>
  );
}
