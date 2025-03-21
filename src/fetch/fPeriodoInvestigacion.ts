import apiBackend from "./api";

export const fGetLastInvestigacionPeriodo = async () => {
  const respond = await apiBackend.get("/data/last_research_period_to_create");
  return respond;
};

export const fGetAllPeriodos = async () => {
  const respond = await apiBackend.get("/data/active_periods");
  return respond;
};

export const fGetAllPeriodosDirector = async () => {
  const respond = await apiBackend.get("/directorData/all-periodos");
  return respond;
};