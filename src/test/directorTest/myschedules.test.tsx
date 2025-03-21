import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DirectorMySchedules from "../../pages/private/director/DirectorMySchedules";
import { vi } from "vitest";
import { fGetEntregasByPeriodo } from "../../fetch/fEntregasPeriodo";
import { fGetAllPeriodos } from "../../fetch/fPeriodoInvestigacion";

// Mock de axios
vi.mock("axios");

// Mock de fGetEntregasByPeriodo y fGetAllPeriodos
vi.mock("../../fetch/fEntregasPeriodo", () => ({
	fGetEntregasByPeriodo: vi.fn(),
}));

vi.mock("../../fetch/fPeriodoInvestigacion", () => ({
	fGetAllPeriodos: vi.fn(),
}));

describe("DirectorMySchedules Component", () => {
	beforeEach(() => {
		// Limpiar todos los mocks antes de cada prueba
		vi.clearAllMocks();
	});

	test("renders DirectorMySchedules component", async () => {
		// Mock de la respuesta de fGetAllPeriodos
		(fGetAllPeriodos as jest.Mock).mockResolvedValue({
			data: [
				{ id: 1, period_number: 1 },
				{ id: 2, period_number: 2 },
			],
		});

		// Mock de la respuesta de fGetEntregasByPeriodo
		(fGetEntregasByPeriodo as jest.Mock).mockResolvedValue({
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
									id: 13,
									delivery_number: 1,
									delivery_status_id: 2,
									start_date: "2025-03-14T00:00:00.000Z",
									finish_date: "2025-03-14T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 4,
									doc_file_route_id: 7,
									review_id: 3,
								},
								{
									id: 16,
									delivery_number: 2,
									delivery_status_id: 1,
									start_date: "2025-06-04T00:00:00.000Z",
									finish_date: "2025-06-04T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 4,
									doc_file_route_id: null,
									review_id: null,
								},
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
								},
							],
						},
					],
				},
				{
					id: 5,
					name: "Proyecto de Leonardo Torres Guzman",
					start_date: "2025-02-26T00:00:00.000Z",
					finish_date: "2025-06-07T00:00:00.000Z",
					status_project_id: 1,
					line_research_id: 1,
					research_period_id: 2,
					user_research_projects: [
						{
							id: 5,
							user_id: 4,
							research_project_id: 5,
							creation_date: "2025-02-27T00:36:26.000Z",
							project_deliveries: [
								{
									id: 14,
									delivery_number: 1,
									delivery_status_id: 1,
									start_date: "2025-03-20T00:00:00.000Z",
									finish_date: "2025-03-20T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 5,
									doc_file_route_id: null,
									review_id: null,
								},
								{
									id: 15,
									delivery_number: 2,
									delivery_status_id: 1,
									start_date: "2025-06-04T00:00:00.000Z",
									finish_date: "2025-06-07T00:00:00.000Z",
									delivery_type_id: 2,
									user_research_project_id: 5,
									doc_file_route_id: null,
									review_id: null,
								},
							],
						},
					],
				},
				{
					id: 6,
					name: "Proyecto de Daniel Pereira Garcia",
					start_date: "2025-02-26T00:00:00.000Z",
					finish_date: "2025-06-14T00:00:00.000Z",
					status_project_id: 1,
					line_research_id: 3,
					research_period_id: 2,
					user_research_projects: [
						{
							id: 6,
							user_id: 5,
							research_project_id: 6,
							creation_date: "2025-02-27T00:36:26.000Z",
							project_deliveries: [
								{
									id: 18,
									delivery_number: 1,
									delivery_status_id: 1,
									start_date: "2025-03-20T00:00:00.000Z",
									finish_date: "2025-03-20T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 6,
									doc_file_route_id: null,
									review_id: null,
								},
								{
									id: 19,
									delivery_number: 2,
									delivery_status_id: 1,
									start_date: "2025-06-11T00:00:00.000Z",
									finish_date: "2025-06-14T00:00:00.000Z",
									delivery_type_id: 2,
									user_research_project_id: 6,
									doc_file_route_id: null,
									review_id: null,
								},
							],
						},
					],
				},
			],
		});

		render(
			<BrowserRouter>
				<DirectorMySchedules />
			</BrowserRouter>,
		);

		// Verificar que el título se renderiza
		expect(screen.getByText("Mis cronogramas")).toBeInTheDocument();

		// Esperar a que se carguen los periodos y se renderice el select
		await waitFor(() => {
			expect(screen.getByText("Seleccione un periodo")).toBeInTheDocument();
		});

		// Simular la selección de un periodo
		fireEvent.mouseDown(screen.getByText("Seleccione un periodo"));
		await waitFor(() => {
			fireEvent.click(screen.getByText("Periodo 2"));
		});
		// Esperar a que se carguen las entregas y se renderice la tabla
		await waitFor(() => {
			expect(
				screen.getByText("Proyecto de Ramiro Perez Lopez"),
			).toBeInTheDocument();
			expect(
				screen.getByText("Proyecto de Leonardo Torres Guzman"),
			).toBeInTheDocument();
			expect(
				screen.getByText("Proyecto de Daniel Pereira Garcia"),
			).toBeInTheDocument();
		});

		// Verificar que los datos de las entregas se rendericen correctamente
		expect(screen.getAllByText("25/2/2025")).toHaveLength(3);
		expect(screen.getAllByText("6/6/2025")).toHaveLength(4);
		expect(screen.getAllByText("25/2/2025")).toHaveLength(3);
		expect(screen.getAllByText("13/6/2025")).toHaveLength(2);

		// Verificar que el botón "Enviar Correos" se renderiza
		expect(screen.getByText("Enviar Correos")).toBeInTheDocument();
	});
});
