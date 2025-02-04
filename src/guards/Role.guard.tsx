import { Outlet } from "react-router-dom";
import useUserStore from "../store/userStore";
const RoleGuard = ({ rol }: { rol: number }) => {
  const role_id = useUserStore((state) => state.role_id);
  console.log(role_id, rol);
  return role_id === rol ? <Outlet></Outlet> : <>Usuario no autorizado </>;
};
export default RoleGuard;
