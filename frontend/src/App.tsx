// Arma la aplicación y verifica la sesión al iniciar.
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { AppRouter } from "@/routes/AppRouter";
import { MainLayout } from "@/shared/layout/MainLayout";
import { Footer } from "@/shared/components/Footer";
import { Toast } from "@/shared/components/Toast";

function App() {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-gray-900">
      <MainLayout>
        <AppRouter />
      </MainLayout>
      <Footer />
      <Toast />
    </div>
  );
}

export default App;
