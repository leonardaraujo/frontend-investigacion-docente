import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { InvestigatorAdvances } from "../../pages/private/investigator/InvestigatorAdvances";
import { vi } from "vitest";
import { fGetAllPeriodos } from "../../fetch/fPeriodoInvestigacion";
import { fGetFullEntregasByPeriodoAndUser } from "../../fetch/fEntregasPeriodo";

// Mock de axios
vi.mock("axios");

// Mock de fGetAllPeriodos y fGetFullEntregasByPeriodoAndUser
vi.mock("../../fetch/fPeriodoInvestigacion", () => ({
	fGetAllPeriodos: vi.fn(),
}));

vi.mock("../../fetch/fEntregasPeriodo", () => ({
	fGetFullEntregasByPeriodoAndUser: vi.fn(),
}));

describe("InvestigatorAdvances Component", () => {
	beforeEach(() => {
		// Limpiar todos los mocks antes de cada prueba
		vi.clearAllMocks();
	});

	test("renders InvestigatorAdvances component", async () => {
		// Mock de la respuesta de fGetAllPeriodos
		(fGetAllPeriodos as jest.Mock).mockResolvedValue({
			data: [
				{ id: 1, period_number: 1, status_id: 1, doc_file_route_id: 1 },
				{ id: 2, period_number: 2, status_id: 1, doc_file_route_id: 6 },
			],
		});

		// Mock de la respuesta de fGetFullEntregasByPeriodoAndUser
		(fGetFullEntregasByPeriodoAndUser as jest.Mock).mockResolvedValue({
			data: [
				{
					id: 1,
					name: "Proyecto de Ramiro Perez Lopez",
					start_date: "2025-02-24T00:00:00.000Z",
					finish_date: "2025-02-28T00:00:00.000Z",
					status_project_id: 3,
					line_research_id: 2,
					research_period_id: 1,
					user_research_projects: [
						{
							id: 2,
							user_id: 3,
							research_project_id: 1,
							creation_date: "2025-02-24T16:00:37.000Z",
							project_deliveries: [
								{
									id: 4,
									delivery_number: 1,
									delivery_status_id: 2,
									start_date: "2025-02-24T00:00:00.000Z",
									finish_date: "2025-02-24T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 2,
									doc_file_route_id: 3,
									review_id: 1,
									review: {
										id: 1,
										user_id: 2,
										status_review_id: 3,
										review_date: "2025-02-24T16:12:17.000Z",
										observation_id: 1,
										comments: "ZXCZXCXZCZCX",
										observation: {
											id: 1,
											user_id: 2,
											start_date: "2025-02-24T00:00:00.000Z",
											finish_date: "2025-02-25T00:00:00.000Z",
											status_observation_id: 4,
											doc_file_route_id: 4,
											comments: "SFBXCSXZCVSVCXVXC",
											doc_file_route: {
												id: 4,
												path: "uploads/deliveries/avances/observations/OBS-1-1740413551318.pdf",
												upload_date: "2025-02-24T16:12:31.000Z",
											},
										},
									},
									doc_file_route: {
										id: 3,
										path: "uploads/deliveries/avances/P1-UP-2-AVANCE_1-1740413518007.pdf",
										upload_date: "2025-02-24T16:11:58.000Z",
									},
								},
								{
									id: 5,
									delivery_number: 2,
									delivery_status_id: 1,
									start_date: "2025-02-25T00:00:00.000Z",
									finish_date: "2025-02-25T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 2,
									doc_file_route_id: null,
									review_id: null,
									review: null,
									doc_file_route: null,
								},
								{
									id: 6,
									delivery_number: 3,
									delivery_status_id: 1,
									start_date: "2025-02-26T00:00:00.000Z",
									finish_date: "2025-02-26T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 2,
									doc_file_route_id: null,
									review_id: null,
									review: null,
									doc_file_route: null,
								},
								{
									id: 7,
									delivery_number: 4,
									delivery_status_id: 1,
									start_date: "2025-02-27T00:00:00.000Z",
									finish_date: "2025-02-27T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 2,
									doc_file_route_id: null,
									review_id: null,
									review: null,
									doc_file_route: null,
								},
								{
									id: 8,
									delivery_number: 5,
									delivery_status_id: 1,
									start_date: "2025-02-28T00:00:00.000Z",
									finish_date: "2025-02-28T00:00:00.000Z",
									delivery_type_id: 1,
									user_research_project_id: 2,
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
				<InvestigatorAdvances />
			</BrowserRouter>,
		);

		// Verificar que el título se renderiza
		expect(screen.getByText("Avances del Investigador")).toBeInTheDocument();

		// Esperar a que se carguen los periodos y se renderice el select
		await waitFor(() => {
			expect(screen.getByText("Seleccione un periodo")).toBeInTheDocument();
		});

		// Esperar a que se carguen las entregas y se renderice la tabla
		await waitFor(() => {
			expect(
				screen.getByText("Nombre: Proyecto de Ramiro Perez Lopez"),
			).toBeInTheDocument();
			expect(screen.getAllByText("23/2/2025")).toHaveLength(2);
			expect(screen.getAllByText("24/2/2025")).toHaveLength(2);
			expect(screen.getAllByText("25/2/2025")).toHaveLength(2);
			expect(screen.getAllByText("26/2/2025")).toHaveLength(2);
			expect(screen.getAllByText("27/2/2025")).toHaveLength(2);
		});
	});
});
