// Ventana modal base con overlay y botón de cierre.
import type { ReactNode } from "react";

type AnchoModal = "sm" | "md" | "lg";

const anchosPorTamano: Record<AnchoModal, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

interface ModalProps {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
  className?: string;
  ancho?: AnchoModal;
}

export function Modal({
  titulo,
  onCerrar,
  children,
  className = "",
  ancho = "md",
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-full ${anchosPorTamano[ancho]} max-h-[90vh] overflow-y-auto ${className}`}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold text-gray-800">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar modal"
            className="text-gray-400 hover:text-gray-700 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
