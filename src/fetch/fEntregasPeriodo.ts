import apiBackend from "./api";

export const fGetEntregasByPeriodo = async (number: number) => {
  const respond = await apiBackend.get(`/data/entregas/periodo/${number}`);
  return respond;
};
