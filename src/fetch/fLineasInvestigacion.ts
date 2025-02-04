import apiBackend from "./api";

export const fgetLineasInvestigacion = async () => {
  const respond = await apiBackend.get("/data/lineas_investigacion");
  return respond;
};
