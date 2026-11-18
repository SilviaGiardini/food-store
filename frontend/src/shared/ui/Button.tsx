// Botón base con tres variantes visuales.
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const estilosPorVariante: Record<ButtonVariant, string> = {
  primary:
    "bg-orange-600 text-white hover:bg-orange-700 shadow-sm",
  secondary:
    "bg-gray-100 text-gray-700 hover:bg-gray-200",
  danger:
    "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${estilosPorVariante[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
