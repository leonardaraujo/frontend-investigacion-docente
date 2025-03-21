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
import SharedLayoutRevisor from "../pages/private/revisor/SharedLayoutRevisor";
import RevisorHome from "../pages/private/revisor/RevisorHome";
import ReviewDeliveries from "../pages/private/revisor/ReviewDeliveries";
import ReviewFinalDeliveries from "../pages/private/revisor/ReviewFinalDeliveries";
import DirectorCreateProjectReport from "../pages/private/director/DirectorCreateProjectReport";
import ManagePeriods from "../pages/private/director/ManagePeriods";
const rol = ["director", "revisor", "investigador"];

const RoutesAppPrivate = () => {
	const navigate = useNavigate();
	const { setUser } = useUserStore();
	const role_id = useUserStore((state) => state.rol_id);
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
	console.log("Dirigiendose a ", rol[role_id - 1]);
	return (
		<RoutesWithNotFound>
			<Route path="/" element={<Navigate to={`${rol[role_id - 1]}`} />} />{" "}
			<Route path="investigador" element={<RoleGuard rol={3} />}>
				<Route element={<SharedLayout />}>
					<Route index element={<Navigate to="home" />} />
					<Route path="home" element={<Home />} />{" "}
					<Route
						path="my-investigations"
						element={<InvestigatorMyInvestigation />}
					/>
					<Route path="advances" element={<InvestigatorAdvances />} />
					<Route path="final-present" element={<InvestigatorFinalPresent />} />
				</Route>
			</Route>
			<Route path="director" element={<RoleGuard rol={1} />}>
				<Route element={<SharedLayoutDirector />}>
					<Route index element={<Navigate to="home" />} />
					<Route path="home" element={<DirectorHome />} />
					<Route path="create-schedule" element={<DirectorCreateSchedule />} />
					<Route path="my-schedules" element={<DirectorMySchedules />} />
					<Route
						path="create-project-report"
						element={<DirectorCreateProjectReport />}
					/>
					<Route path="manage-periods" element={<ManagePeriods />} />
				</Route>
			</Route>
			<Route path="revisor" element={<RoleGuard rol={2} />}>
				<Route element={<SharedLayoutRevisor />}>
					<Route index element={<Navigate to="home" />} />
					<Route path="home" element={<RevisorHome />} />
					<Route path="review-deliveries" element={<ReviewDeliveries />} />
					<Route
						path="review-final-deliveries"
						element={<ReviewFinalDeliveries />}
					/>
				</Route>
			</Route>
		</RoutesWithNotFound>
	);
};

export default RoutesAppPrivate;
