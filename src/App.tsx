import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ContentProvider } from "@/context/ContentContext";
import { AppRoutes } from "@/router";

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}
