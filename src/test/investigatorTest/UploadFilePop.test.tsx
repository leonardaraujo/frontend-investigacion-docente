import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UploadFilePopUp from "../../components/investigator/UploadFilePopUp";
import { vi } from "vitest";

// Mock de axios
vi.mock("axios");

describe("UploadFilePopUp Component", () => {
	beforeEach(() => {
		// Limpiar todos los mocks antes de cada prueba
		vi.clearAllMocks();
	});

	const mockOnClose = vi.fn();
	const mockOnUploadSuccess = vi.fn();
	const mockDelivery = { id: 1 };

	test("accepts PDF files and rejects other types", async () => {
		render(
			<BrowserRouter>
				<UploadFilePopUp
					open={true}
					onClose={mockOnClose}
					delivery={mockDelivery}
					onUploadSuccess={mockOnUploadSuccess}
				/>
			</BrowserRouter>,
		);

		// Verificar que el título se renderiza
		expect(screen.getByText("Subir avance")).toBeInTheDocument();

		// Simular la subida de un archivo PDF
		const input = screen.getByTestId("inputPDF");
		const file = new File(["dummy content"], "example.pdf", {
			type: "application/pdf",
		});

		fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			expect(
				screen.getByText("Archivo seleccionado: ./example.pdf - 0.00 MB"),
			).toBeInTheDocument();
		});

		// Simular la subida de un archivo no PDF
		const nonPdfFile = new File(["dummy content"], "example.txt", {
			type: "text/plain",
		});

		fireEvent.change(input, { target: { files: [nonPdfFile] } });

		await waitFor(() => {
			expect(
				screen.queryByText("Archivo seleccionado: ./example.txt - 0.00 MB"),
			).not.toBeInTheDocument();
		});
	});
});
