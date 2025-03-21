import dayjs from "dayjs";
import { fGetLastInvestigacionPeriodo } from "../fetch/fPeriodoInvestigacion";
import { fGetInvestigators } from "../fetch/fUser";
import { INVESTIGATION_LINES } from "../constants/data/VariableInvestigationLines";

export const fetchInitialData = async (
	setLastPeriod,
	setInvestigators,
	setLineasInvestigacion,
) => {
	const lastPeriodResponse = await fGetLastInvestigacionPeriodo();
	setLastPeriod(lastPeriodResponse.data.period_number);

	const investigatorsResponse = await fGetInvestigators();
	setInvestigators(investigatorsResponse.data);

	const transformedLineas = INVESTIGATION_LINES.map((linea) => ({
		value: linea.id,
		label: linea.name,
	}));
	setLineasInvestigacion(transformedLineas);
};

export const updateAvance = (scheduleCart, id, newAvance) => {
	return scheduleCart.map((item) =>
		item.id_user === id
			? {
					...item,
					avances: newAvance.avances.avancesData
						? newAvance.avances.avancesData.map((avance) => ({
								...avance,
								fechaInit: dayjs(avance.fechaInit).format("YYYY-MM-DD"),
								fechaFinish: dayjs(avance.fechaFinish).format("YYYY-MM-DD"),
							}))
						: [],
				}
			: item,
	);
};

export const updateLineaInvestigacion = (scheduleCart, id, newLinea) => {
	return scheduleCart.map((item) =>
		item.id_user === id
			? {
					...item,
					linea_id: newLinea,
				}
			: item,
	);
};

export const updateFechaInicio = (scheduleCart, id, newFechaInicio) => {
	return scheduleCart.map((item) =>
		item.id_user === id
			? {
					...item,
					fechaInicio: newFechaInicio
						? newFechaInicio.format("YYYY-MM-DD")
						: null,
					fechaEntrega: null, // Restablecer fechaEntrega a null
					avances: [],
				}
			: item,
	);
};

export const updateFechaEntrega = (scheduleCart, id, newFechaEntrega) => {
	return scheduleCart.map((item) =>
		item.id_user === id
			? {
					...item,
					fechaEntrega: newFechaEntrega
						? newFechaEntrega.format("YYYY-MM-DD")
						: null,
					avances: { avancesData: [], cantAvances: 0 },
				}
			: item,
	);
};

export const handleAddUsers = (selectedUsers, investigators, scheduleCart) => {
	const newUsers = selectedUsers
		.map((user) => {
			const foundUser = investigators.find((u) => u?.id === user.value);
			if (!foundUser) {
				console.error(`User with id ${user.value} not found`);
				return null;
			}
			const alreadyExists = scheduleCart.some(
				(existingUser) => existingUser.id_user === user.value,
			);
			if (alreadyExists) {
				console.error(`User with id ${user.value} already added`);
				return null;
			}
			return {
				id_user: user.value,
				name: `${foundUser.name} ${foundUser.paternal_surname} ${foundUser.maternal_surname}`,
				linea_id: "",
				avances: {
					cantAvances: 0,
					avancesData: [],
				},
				fechaInicio: null,
				fechaEntrega: null,
			};
		})
		.filter((user) => user !== null);

	return newUsers.length > 0 ? [...scheduleCart, ...newUsers] : scheduleCart;
};

interface Schedule {
	id_user: number;
	name: string;
	linea_id: number;
	avances: Avance[];
	fechaInicio: string;
	fechaEntrega: string;
}
export const isScheduleCartValid = (scheduleCart: Schedule[]): boolean => {
	if (scheduleCart.length === 0) {
		return false;
	}
	return scheduleCart.every((schedule) => {
		return (
			schedule.linea_id !== null &&
			schedule.linea_id !== "" &&
			schedule.avances.length > 0 &&
			schedule.fechaInicio !== null &&
			schedule.fechaEntrega !== null
		);
	});
};
