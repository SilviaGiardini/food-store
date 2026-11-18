// Arma la aplicación y verifica la sesión al iniciar.
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { AppRouter } from "@/routes/AppRouter";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Toast } from "@/shared/components/Toast";
import { useThemeStore } from "@/store/themeStore";

function App() {
  const checkSession = useAuthStore((state) => state.checkSession);
  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors ${
      darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-gray-900"
    }`}>
      <Navbar />

      <main className="flex-1">
        <AppRouter />
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default App;
