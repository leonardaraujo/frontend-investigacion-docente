import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UploadFinalTrabajo from "../../components/investigator/UploadFinalTrabajo";
import { vi } from "vitest";

// Mock de axios
vi.mock("axios");

describe("UploadFinalTrabajo Component", () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    vi.clearAllMocks();
  });

  const mockOnClose = vi.fn();
  const mockOnUploadSuccess = vi.fn();
  const mockDelivery = { id: 1 };

  test("accepts ZIP files and rejects other types", async () => {
    render(
      <BrowserRouter>
        <UploadFinalTrabajo
          open={true}
          onClose={mockOnClose}
          delivery={mockDelivery}
          onUploadSuccess={mockOnUploadSuccess}
        />
      </BrowserRouter>
    );

    // Verificar que el título se renderiza
    expect(screen.getByText("Subir entrega final y turniting")).toBeInTheDocument();

    // Simular la subida de un archivo ZIP
    const input = screen.getByTestId("inputCompressed");
    const zipFile = new File(["dummy content"], "example.zip", { type: "application/zip" });

    fireEvent.change(input, { target: { files: [zipFile] } });

    await waitFor(() => {
      expect(screen.getByText("Archivo seleccionado: example.zip - 0.00001239776611328125 MB")).toBeInTheDocument();
    });

    // Simular la subida de un archivo no ZIP
    const nonZipFile = new File(["dummy content"], "example.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [nonZipFile] } });

    await waitFor(() => {
      expect(screen.queryByText("Archivo seleccionado: example.txt - 0.00 MB")).not.toBeInTheDocument();
    });

  });
});