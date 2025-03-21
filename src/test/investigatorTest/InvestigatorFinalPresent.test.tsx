import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import InvestigatorFinalPresent from "../../pages/private/investigator/InvestigatorFinalPresent";
import { vi } from "vitest";
import { fGetAllPeriodos } from "../../fetch/fPeriodoInvestigacion";
import { fGetFinalesByPeriodoAndUser } from "../../fetch/fEntregasPeriodo";

// Mock de axios
vi.mock("axios");

// Mock de fGetAllPeriodos y fGetFinalesByPeriodoAndUser
vi.mock("../../fetch/fPeriodoInvestigacion", () => ({
	fGetAllPeriodos: vi.fn(),
}));

vi.mock("../../fetch/fEntregasPeriodo", () => ({
	fGetFinalesByPeriodoAndUser: vi.fn(),
}));

describe("InvestigatorFinalPresent Component", () => {
	beforeEach(() => {
		// Limpiar todos los mocks antes de cada prueba
		vi.clearAllMocks();
	});

	test("renders InvestigatorFinalPresent component", async () => {
		// Mock de la respuesta de fGetAllPeriodos
		(fGetAllPeriodos as jest.Mock).mockResolvedValue({
			data: [
				{ id: 1, period_number: 1, status_id: 1, doc_file_route_id: 1 },
				{ id: 2, period_number: 2, status_id: 1, doc_file_route_id: 6 },
			],
		});

		// Mock de la respuesta de fGetFinalesByPeriodoAndUser
		(fGetFinalesByPeriodoAndUser as jest.Mock).mockResolvedValue({
			data: [
				{
					id: 4,
					name: "Proyecto de Ramiro Perez Lopez",
					start_date: "2025-02-26T00:00:00.000Z",
					finish_date: "2025-06-07T00:00:00.000Z",
					status_project_id: 1,
					line_research_id: 2,
					research_period_id: 2,
					user_research_projects: [
						{
							id: 4,
							user_id: 3,
							research_project_id: 4,
							creation_date: "2025-02-27T00:36:26.000Z",
							project_deliveries: [
								{
									id: 17,
									delivery_number: 3,
									delivery_status_id: 1,
									start_date: "2025-06-04T00:00:00.000Z",
									finish_date: "2025-06-07T00:00:00.000Z",
									delivery_type_id: 2,
									user_research_project_id: 4,
									doc_file_route_id: null,
									review_id: null,
									review: null,
									doc_file_route: null,
								},
							],
						},
					],
				},
			],
		});

		render(
			<BrowserRouter>
				<InvestigatorFinalPresent />
			</BrowserRouter>,
		);

		// Verificar que el título se renderiza
		expect(
			screen.getByText("Presentaciones Finales del Investigador"),
		).toBeInTheDocument();

		// Esperar a que se carguen los periodos y se renderice el select
		await waitFor(() => {
			expect(screen.getByText("Seleccione un periodo")).toBeInTheDocument();
		});

		// Esperar a que se carguen las entregas y se renderice la tabla
		await waitFor(() => {
			expect(
				screen.getByText("Nombre: Proyecto de Ramiro Perez Lopez"),
			).toBeInTheDocument();
			expect(screen.getByText("3/6/2025")).toBeInTheDocument();
			expect(screen.getByText("6/6/2025")).toBeInTheDocument();
		});
	});
});
