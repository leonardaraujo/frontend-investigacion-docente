import { create } from "zustand";

interface IUser {
  id: number;
  email: string;
  name: string;
  apellido_paterno: string;
  apellido_materno: string;
  role_id: number;
}
interface userStore extends IUser {
  setUser: (payload: IUser) => void;
  deleteUser: () => void;
}
const useUserStore = create<userStore>((set) => ({
  id: 0,
  email: "",
  name: "",
  apellido_paterno: "",
  apellido_materno: "",
  role_id: 0,
  setUser: (payload: IUser) =>
    set(
      (): IUser => ({
        id: payload.id,
        email: payload.email,
        name: payload.name,
        apellido_paterno: payload.apellido_paterno,
        apellido_materno: payload.apellido_materno,
        role_id: payload.role_id,
      })
    ),
  deleteUser: () =>
    set(
      (): IUser => ({
        id: 0,
        email: "",
        name: "",
        apellido_paterno: "",
        apellido_materno: "",
        role_id: 0,
      })
    ),
}));
export default useUserStore;
