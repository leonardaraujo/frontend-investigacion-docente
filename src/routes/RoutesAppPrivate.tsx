import { useEffect } from "react";
import { Route, Navigate, useNavigate } from "react-router-dom";
import { fGetUser } from "../fetch/fUser";
import useUserStore from "../store/userStore";
import RoleGuard from "../guards/Role.guard";
import SharedLayout from "../components/SharedLayout";
import Home from "../pages/Home";
import RoutesWithNotFound from "./RoutesWithNotFound";
import DirectorHome from "../pages/private/director/DirectorHome";
import SharedLayoutDirector from "../pages/private/director/SharedLayoutDirector";
import DirectorCreateSchedule from "../pages/private/director/DirectorCreateSchedule";
import DirectorMySchedules from "../pages/private/director/DirectorMySchedules";
const role = ["director", "investigator"];
const RoutesAppPrivate = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const role_id = useUserStore((state) => state.role_id);
  useEffect(() => {
    // fetching user
    fGetUser(JSON.parse(sessionStorage.getItem("token") || ""))
      .then((response: any) => {
        console.log("setting user", response.data);
        setUser(response.data);
      })
      .catch(() => {
        sessionStorage.clear();
        navigate("/login", { replace: true });
      });
  }, []);
  console.log("Dirigiendose a ", role[role_id]);
  console.log("El rol es", role_id);
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={`${role[role_id]}`} />} />{" "}
      <Route path="director" element={<RoleGuard rol={2} />}>
        <Route element={<SharedLayoutDirector />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<DirectorHome />} />
          <Route
            path="create-schedule"
            element={<DirectorCreateSchedule></DirectorCreateSchedule>}
          />
          <Route
            path="my-schedules"
            element={<DirectorMySchedules></DirectorMySchedules>}
          />
        </Route>
      </Route>
      <Route path="investigator" element={<RoleGuard rol={1} />}>
        <Route element={<SharedLayout />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Route>
    </RoutesWithNotFound>
  );
};

export default RoutesAppPrivate;
