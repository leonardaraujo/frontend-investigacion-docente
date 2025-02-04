import apiBackend from "./api";

export const fCreateSchedule = async (scheduleData: any) => {
  try {
    const response = await apiBackend.post("/crear_proyectos_y_entregas", { DATA: scheduleData });
    return response.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};