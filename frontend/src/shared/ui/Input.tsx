// Campo de formulario con etiqueta y mensaje de error.
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
}

export function Input({
  id,
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        aria-invalid={Boolean(error)}
        {...props}
        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-200 focus:ring-orange-500"
        } ${className}`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
