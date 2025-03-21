import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DirectorCreateSchedule from "../../pages/private/director/DirectorCreateSchedule";
import { vi } from "vitest";
import { fGetInvestigators } from "../../fetch/fUser";
import { fGetLastInvestigacionPeriodo } from "../../fetch/fPeriodoInvestigacion";

// Mock de axios
vi.mock("axios");

// Mock de fGetInvestigators y fGetLastInvestigacionPeriodo
vi.mock("../../fetch/fPeriodoInvestigacion", () => ({
	fGetLastInvestigacionPeriodo: vi.fn(),
}));

// Mock de fGetInvestigators y fGetLastInvestigacionPeriodo
vi.mock("../../fetch/fUser", () => ({
	fGetInvestigators: vi.fn(),
}));

describe("DirectorCreateSchedule Component", () => {
	beforeEach(() => {
		// Limpiar todos los mocks antes de cada prueba
		vi.clearAllMocks();
	});

	test("renders DirectorCreateSchedule component", async () => {
		// Mock de la respuesta de fGetInvestigators
		(fGetInvestigators as jest.Mock).mockResolvedValue({
			data: [
				{
					id: 3,
					name: "Ramiro",
					paternal_surname: "Perez",
					maternal_surname: "Lopez",
					email: "74875111@continental.edu.pe",
					password:
						"$2a$10$Joh1uhOcifzvb.fsd610SutNuJ7OIfIJn/jeVaIyK4UCg.9Oxlf7i",
					rol_id: 3,
				},
				{
					id: 4,
					name: "Leonardo",
					paternal_surname: "Torres",
					maternal_surname: "Guzman",
					email: "leonardodanielaraujohuamani@gmail.com",
					password:
						"$2a$10$Joh1uhOcifzvb.fsd610SutNuJ7OIfIJn/jeVaIyK4UCg.9Oxlf7i",
					rol_id: 3,
				},
				{
					id: 5,
					name: "Daniel",
					paternal_surname: "Pereira",
					maternal_surname: "Garcia",
					email: "leonardo_oct@hotmail.com",
					password:
						"$2a$10$Joh1uhOcifzvb.fsd610SutNuJ7OIfIJn/jeVaIyK4UCg.9Oxlf7i",
					rol_id: 3,
				},
			],
		});

		// Mock de la respuesta de fGetLastInvestigacionPeriodo
		(fGetLastInvestigacionPeriodo as jest.Mock).mockResolvedValue({
			data: {
				message: "Nuevo periodo",
				period_number: 3,
			},
		});

		render(
			<BrowserRouter>
				<DirectorCreateSchedule />
			</BrowserRouter>,
		);

		// Verificar que el título se renderiza
		expect(screen.getByText("Creacion de cronograma")).toBeInTheDocument();

		// Esperar a que se cargue el periodo y se renderice el input
		await waitFor(() => {
			expect(screen.getByDisplayValue("3")).toBeInTheDocument();
		});

		// Verificar que el botón "Agregar usuario" se renderiza
		expect(screen.getByText("Agregar usuario")).toBeInTheDocument();

		// Verificar que la tabla se renderiza
		expect(screen.getByText("Codigo Docente")).toBeInTheDocument();
		expect(screen.getByText("Nombre Docente")).toBeInTheDocument();
		expect(screen.getByText("Linea de Investigación")).toBeInTheDocument();
		expect(screen.getByText("Avances y Fechas")).toBeInTheDocument();
		expect(screen.getByText("Fecha Inicio")).toBeInTheDocument();
		expect(screen.getByText("Fecha Entrega Final")).toBeInTheDocument();
		expect(screen.getByText("Eliminar")).toBeInTheDocument();
	});
});
