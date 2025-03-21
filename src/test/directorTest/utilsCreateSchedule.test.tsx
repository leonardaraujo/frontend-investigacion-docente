import {
	fetchInitialData,
	updateAvance,
	updateLineaInvestigacion,
	updateFechaInicio,
	updateFechaEntrega,
	handleAddUsers,
	isScheduleCartValid,
} from "../../utils/scheduleUtils";
import { fGetLastInvestigacionPeriodo } from "../../fetch/fPeriodoInvestigacion";
import { fGetInvestigators } from "../../fetch/fUser";
import { INVESTIGATION_LINES } from "../../constants/data/VariableInvestigationLines";
import dayjs from "dayjs";
import { vi } from "vitest";

// Mock de las funciones fetch
vi.mock("../../fetch/fPeriodoInvestigacion", () => ({
	fGetLastInvestigacionPeriodo: vi.fn(),
}));

vi.mock("../../fetch/fUser", () => ({
	fGetInvestigators: vi.fn(),
}));

describe("Schedule Utils", () => {
	beforeEach(() => {
		// Limpiar todos los mocks antes de cada prueba
		vi.clearAllMocks();
	});

	test("fetchInitialData should fetch and set initial data", async () => {
		const setLastPeriod = vi.fn();
		const setInvestigators = vi.fn();
		const setLineasInvestigacion = vi.fn();

		(fGetLastInvestigacionPeriodo as jest.Mock).mockResolvedValue({
			data: { period_number: 3 },
		});

		(fGetInvestigators as jest.Mock).mockResolvedValue({
			data: [
				{
					id: 3,
					name: "Ramiro",
					paternal_surname: "Perez",
					maternal_surname: "Lopez",
					email: "74875111@continental.edu.pe",
					rol_id: 3,
				},
				{
					id: 4,
					name: "Leonardo",
					paternal_surname: "Torres",
					maternal_surname: "Guzman",
					email: "leonardodanielaraujohuamani@gmail.com",
					rol_id: 3,
				},
				{
					id: 5,
					name: "Daniel",
					paternal_surname: "Pereira",
					maternal_surname: "Garcia",
					email: "leonardo_oct@hotmail.com",
					rol_id: 3,
				},
			],
		});

		await fetchInitialData(
			setLastPeriod,
			setInvestigators,
			setLineasInvestigacion,
		);

		expect(setLastPeriod).toHaveBeenCalledWith(3);
		expect(setInvestigators).toHaveBeenCalledWith([
			{
				id: 3,
				name: "Ramiro",
				paternal_surname: "Perez",
				maternal_surname: "Lopez",
				email: "74875111@continental.edu.pe",
				rol_id: 3,
			},
			{
				id: 4,
				name: "Leonardo",
				paternal_surname: "Torres",
				maternal_surname: "Guzman",
				email: "leonardodanielaraujohuamani@gmail.com",
				rol_id: 3,
			},
			{
				id: 5,
				name: "Daniel",
				paternal_surname: "Pereira",
				maternal_surname: "Garcia",
				email: "leonardo_oct@hotmail.com",
				rol_id: 3,
			},
		]);
		expect(setLineasInvestigacion).toHaveBeenCalledWith(
			INVESTIGATION_LINES.map((linea) => ({
				value: linea.id,
				label: linea.name,
			})),
		);
	});

	test("updateAvance should update avances in the schedule cart", () => {
		const scheduleCart = [
			{
				id_user: 3,
				name: "Ramiro Perez Lopez",
				linea_id: 1,
				avances: [],
				fechaInicio: "2025-02-24",
				fechaEntrega: "2025-02-28",
			},
		];

		const newAvance = {
			id_user: 3,
			avances: {
				avancesData: [
					{ index: 1, fechaInit: "2025-02-24", fechaFinish: "2025-02-25" },
				],
			},
		};

		const updatedCart = updateAvance(scheduleCart, 3, newAvance);

		expect(updatedCart[0].avances).toEqual([
			{ index: 1, fechaInit: "2025-02-24", fechaFinish: "2025-02-25" },
		]);
	});

	test("updateLineaInvestigacion should update linea de investigacion in the schedule cart", () => {
		const scheduleCart = [
			{
				id_user: 3,
				name: "Ramiro Perez Lopez",
				linea_id: 1,
				avances: [],
				fechaInicio: "2025-02-24",
				fechaEntrega: "2025-02-28",
			},
		];

		const updatedCart = updateLineaInvestigacion(scheduleCart, 3, 2);

		expect(updatedCart[0].linea_id).toBe(2);
	});

	test("updateFechaInicio should update fechaInicio and reset fechaEntrega and avances in the schedule cart", () => {
		const scheduleCart = [
			{
				id_user: 3,
				name: "Ramiro Perez Lopez",
				linea_id: 1,
				avances: [
					{ index: 1, fechaInit: "2025-02-24", fechaFinish: "2025-02-25" },
				],
				fechaInicio: "2025-02-24",
				fechaEntrega: "2025-02-28",
			},
		];

		const updatedCart = updateFechaInicio(scheduleCart, 3, dayjs("2025-03-01"));

		expect(updatedCart[0].fechaInicio).toBe("2025-03-01");
		expect(updatedCart[0].fechaEntrega).toBeNull();
		expect(updatedCart[0].avances).toEqual([]);
	});

	test("updateFechaEntrega should update fechaEntrega and reset avances in the schedule cart", () => {
		const scheduleCart = [
			{
				id_user: 3,
				name: "Ramiro Perez Lopez",
				linea_id: 1,
				avances: [
					{ index: 1, fechaInit: "2025-02-24", fechaFinish: "2025-02-25" },
				],
				fechaInicio: "2025-02-24",
				fechaEntrega: "2025-02-28",
			},
		];

		const updatedCart = updateFechaEntrega(
			scheduleCart,
			3,
			dayjs("2025-03-01"),
		);

		expect(updatedCart[0].fechaEntrega).toBe("2025-03-01");
		expect(updatedCart[0].avances).toEqual({ avancesData: [], cantAvances: 0 });
	});

	test("handleAddUsers should add new users to the schedule cart", () => {
		const investigators = [
			{
				id: 3,
				name: "Ramiro",
				paternal_surname: "Perez",
				maternal_surname: "Lopez",
				email: "74875111@continental.edu.pe",
				rol_id: 3,
			},
			{
				id: 4,
				name: "Leonardo",
				paternal_surname: "Torres",
				maternal_surname: "Guzman",
				email: "leonardodanielaraujohuamani@gmail.com",
				rol_id: 3,
			},
			{
				id: 5,
				name: "Daniel",
				paternal_surname: "Pereira",
				maternal_surname: "Garcia",
				email: "leonardo_oct@hotmail.com",
				rol_id: 3,
			},
		];

		const selectedUsers = [{ value: 4, label: "Leonardo Torres Guzman" }];

		const scheduleCart = [
			{
				id_user: 3,
				name: "Ramiro Perez Lopez",
				linea_id: 1,
				avances: [],
				fechaInicio: "2025-02-24",
				fechaEntrega: "2025-02-28",
			},
		];

		const updatedCart = handleAddUsers(
			selectedUsers,
			investigators,
			scheduleCart,
		);

		expect(updatedCart).toHaveLength(2);
		expect(updatedCart[1]).toEqual({
			id_user: 4,
			name: "Leonardo Torres Guzman",
			linea_id: "",
			avances: { cantAvances: 0, avancesData: [] },
			fechaInicio: null,
			fechaEntrega: null,
		});
	});
	test("isScheduleCartValid should validate the schedule cart correctly", () => {
		const validScheduleCart = [
			{
				id_user: 3,
				name: "Ramiro Perez Lopez",
				linea_id: 1,
				avances: [
					{ index: 1, fechaInit: "2025-02-24", fechaFinish: "2025-02-25" },
				],
				fechaInicio: "2025-02-24",
				fechaEntrega: "2025-02-28",
			},
		];

		const invalidScheduleCart = [
			{
				id_user: 3,
				name: "Ramiro Perez Lopez",
				linea_id: null,
				avances: [],
				fechaInicio: null,
				fechaEntrega: null,
			},
		];

		expect(isScheduleCartValid(validScheduleCart)).toBe(true);
		expect(isScheduleCartValid(invalidScheduleCart)).toBe(false);
	});
});
