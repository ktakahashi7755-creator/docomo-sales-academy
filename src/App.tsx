import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ContentProvider } from "@/context/ContentContext";
import { CertificationProvider } from "@/context/CertificationContext";
import { AppRoutes } from "@/router";

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <CertificationProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </BrowserRouter>
        </CertificationProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
