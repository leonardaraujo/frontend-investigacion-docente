import IUserLogin from "../interfaces/UserLogin.interface";
import apiBackend from "./api";
export const fLogin = async (data: IUserLogin) => {
  const respond = await apiBackend.post("/auth/login", data);
  return respond;
};
export const fGetUser = async (token: string | null) => {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const respond = await apiBackend.get("/auth/getUser", config);
  return respond;
};

export const fGetInvestigators = async () => {
  const respond = await apiBackend.get("/data/usuarios/role/1");
  return respond;
};