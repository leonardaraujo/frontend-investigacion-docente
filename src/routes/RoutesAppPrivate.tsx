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
import { useState } from "react";
import InvestigatorMyInvestigation from "../pages/private/investigator/InvestigatorMyInvestigation";
import { InvestigatorAdvances } from "../pages/private/investigator/InvestigatorAdvances";
import InvestigatorFinalPresent from "../pages/private/investigator/InvestigatorFinalPresent";
const role = ["investigator", "director"];

const RoutesAppPrivate = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const role_id = useUserStore((state) => state.role_id);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // fetching user
    fGetUser(JSON.parse(sessionStorage.getItem("token") || ""))
      .then((response: any) => {
        console.log("setting user", response.data);
        setUser(response.data);
        setLoading(false);
      })
      .catch(() => {
        sessionStorage.clear();
        navigate("/login", { replace: true });
      });
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }
  console.log("Dirigiendose a ", role[role_id - 1]);
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={`${role[role_id - 1]}`} />} />{" "}
      <Route path="investigator" element={<RoleGuard rol={1} />}>
        <Route element={<SharedLayout />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />{" "}
          <Route path="my-investigations" element={<InvestigatorMyInvestigation />}></Route>
          <Route path="advances" element={<InvestigatorAdvances />}></Route>
          <Route path="final-present" element={<InvestigatorFinalPresent />}></Route>
        </Route>
      </Route>
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
    </RoutesWithNotFound>
  );
};

export default RoutesAppPrivate;
