import axios from "axios";

export function handleApiError(
  error: unknown,
  mensajePorDefecto: string
): string {
  if (axios.isAxiosError(error)) {
    const detalle: unknown = error.response?.data?.detail;
    if (typeof detalle === "string") {
      return detalle;
    }
    if (!error.response) {
      return "No se pudo conectar con el servidor";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return mensajePorDefecto;
}
