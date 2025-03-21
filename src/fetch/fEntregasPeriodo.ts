import apiBackend from "./api";

export const fGetEntregasByPeriodo = async (number: number) => {
	const respond = await apiBackend.get(`/data/deliveries_by_period/${number}`);
	return respond;
};


export const fGetAllFullEntregasByPeriodo = async (number: number) => {
	const respond = await apiBackend.get(
		`/data/deliveries_full_by_period/${number}`,
	);
	return respond;
};

export const fGetFullEntregasByPeriodo = async (number: number) => {
	const respond = await apiBackend.get(
		`/data/deliveries_only_avances_by_period_full/${number}`,
	);
	return respond;
};

export const fGetFullFinalesByPeriodo = async (number: number) => {
	console.log(`/data/deliveries_only_final_by_period_full/${number}`);
	const respond = await apiBackend.get(
		`/data/deliveries_only_final_by_period_full/${number}`,
	);
	return respond;
};

export const fGetFullEntregasByPeriodoAndUser = async (
	user: number,
	period_number: number,
) => {
	const respond = await apiBackend.get(
		`/data/deliveries_only_avances_by_user_and_period_full/${user}/${period_number}`,
	);
	return respond;
};

export const fGetFinalesByPeriodoAndUser = async (
	user: number,
	period_number: number,
) => {
	const respond = await apiBackend.get(
		`/data/deliveries_only_final_by_user_and_period_full/${user}/${period_number}`,
	);
	return respond;
};

export const fGetEntregasByUserAndPeriod = async (userId, selectedPeriodo) => {
	const respond = await apiBackend.get(
		`userData/deliveries_by_user_and_period/${userId}/${selectedPeriodo}`,
	);
	return respond;
};
