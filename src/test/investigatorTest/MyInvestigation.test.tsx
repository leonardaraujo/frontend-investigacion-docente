import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import InvestigatorMyInvestigation from "../../pages/private/investigator/InvestigatorMyInvestigation";
import { vi } from "vitest";
import { fGetAllPeriodos } from "../../fetch/fPeriodoInvestigacion";
import { fGetEntregasByUserAndPeriod } from "../../fetch/fEntregasPeriodo";
import { MY_INVESTIGATION_DATA_MOCK } from "../data_mock/my_investigation_data_mock";

// Mock de axios
vi.mock("axios");

// Mock de fGetAllPeriodos y fGetEntregasByUserAndPeriod
vi.mock("../../fetch/fPeriodoInvestigacion", () => ({
	fGetAllPeriodos: vi.fn(),
}));

vi.mock("../../fetch/fEntregasPeriodo", () => ({
	fGetEntregasByUserAndPeriod: vi.fn(),
}));

describe("InvestigatorMyInvestigation Component", () => {
	beforeEach(() => {
		// Limpiar todos los mocks antes de cada prueba
		vi.clearAllMocks();
	});

	test("renders InvestigatorMyInvestigation component", async () => {
		// Mock de la respuesta de fGetAllPeriodos
		(fGetAllPeriodos as jest.Mock).mockResolvedValue({
			data: [
				{ id: 1, period_number: 1, status_id: 1, doc_file_route_id: 1 },
				{ id: 2, period_number: 2, status_id: 1, doc_file_route_id: 6 },
			],
		});

		// Mock de la respuesta de fGetEntregasByUserAndPeriod
		(fGetEntregasByUserAndPeriod as jest.Mock).mockResolvedValue({
			data: MY_INVESTIGATION_DATA_MOCK,
		});

		render(
			<BrowserRouter>
				<InvestigatorMyInvestigation />
			</BrowserRouter>,
		);

		// Verificar que el título se renderiza
		expect(screen.getByText("Mis Investigaciones")).toBeInTheDocument();

		// Esperar a que se carguen los periodos y se renderice el select
		await waitFor(() => {
			expect(screen.getByText("Seleccione un periodo")).toBeInTheDocument();
		});

		// Esperar a que se carguen las entregas y se renderice la tabla
		await waitFor(() => {
			expect(
				screen.getByText("Proyecto de Ramiro Perez Lopez"),
			).toBeInTheDocument();
			expect(screen.getByText("25/2/2025")).toBeInTheDocument();
			expect(screen.getByText("6/6/2025")).toBeInTheDocument();
			expect(
				screen.getByText("Entrega 1: 13/3/2025 - 13/3/2025"),
			).toBeInTheDocument();
			expect(
				screen.getByText("Entrega 2: 3/6/2025 - 3/6/2025"),
			).toBeInTheDocument();
			expect(
				screen.getByText("Entrega 3: 3/6/2025 - 6/6/2025"),
			).toBeInTheDocument();
		});
	});
});
