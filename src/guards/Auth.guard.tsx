import { Outlet, Navigate } from "react-router-dom";
const AuthGuard = () => {
  const user = sessionStorage.getItem("token");
  return user ? <Outlet /> : <Navigate replace to={"/login"} />;
};
export default AuthGuard;
