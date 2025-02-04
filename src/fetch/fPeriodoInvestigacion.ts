import apiBackend from "./api";

export const fGetLastInvestigacionPeriodo = async () => {
  const respond = await apiBackend.get("/data/ultimo_periodo_investigacion");
  return respond;
};

export const fGetAllPeriodos = async () => {
  const respond = await apiBackend.get("/data/periodos");
  return respond;
};