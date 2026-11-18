import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { AppRouter } from "@/routes/AppRouter";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Toast } from "@/shared/components/Toast";
import { useThemeStore } from "@/store/themeStore";

// Componente principal: compone la estructura general, verifica sesión y monta el router
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const darkMode = useThemeStore((state) => state.darkMode);

  // Verificamos si existe una sesión activa al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
