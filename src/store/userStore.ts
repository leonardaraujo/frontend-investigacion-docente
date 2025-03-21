import { create } from "zustand";

interface IUser {
  id: number;
  email: string;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  rol_id: number;
}
interface userStore extends IUser {
  setUser: (payload: IUser) => void;
  deleteUser: () => void;
}
const useUserStore = create<userStore>((set) => ({
  id: 0,
  email: "",
  name: "",
  paternal_surname: "",
  maternal_surname: "",
  rol_id: 0,
  setUser: (payload: IUser) =>
    set(
      (): IUser => ({
        id: payload.id,
        email: payload.email,
        name: payload.name,
        paternal_surname: payload.paternal_surname,
        maternal_surname: payload.maternal_surname,
        rol_id: payload.rol_id,
      })
    ),
  deleteUser: () =>
    set(
      (): IUser => ({
        id: 0,
        email: "",
        name: "",
        paternal_surname: "",
        maternal_surname: "",
        rol_id: 0,
      })
    ),
}));
export default useUserStore;
