// Estructura común de la aplicación: Navbar arriba y la página actual abajo.
import type { ReactNode } from "react";

import { Navbar } from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
    </>
  );
}

export default MainLayout;
