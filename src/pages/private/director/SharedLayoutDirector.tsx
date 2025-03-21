import { Outlet } from "react-router-dom";
import {
	MainLayout,
	MenuAppLayout,
} from "../../../components/layout/Main.layout";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import useUserStore from "../../../store/userStore";
import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import {
	AvatarSignOutLayout,
	MenuDisplayContainer,
	MenuGrid,
	MenuMainContainer,
} from "../../../components/style/Menu.style";
import { CustomNavLink } from "../../../components/style/NavLink.style";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { ROLES } from "../../../constants/data/VariablesRoles";
import { SECONDARY_COLOR_CONF } from "../../../conf/COLORS.conf";
import { LOGO_IMAGES } from "../../../conf/IMAGES.conf";
const SharedLayoutDirector = () => {
	const { rol_id, email, name, paternal_surname, maternal_surname } =
		useUserStore();
	const { deleteUser } = useUserStore();
	const navigate = useNavigate();
	const [token, setToken] = useSessionStorage("token", "");
	const handleSignOut = () => {
		setToken("");
		deleteUser();
		navigate("/login", { replace: true });
	};
	const userRole =
		ROLES.find((role) => role.id === rol_id)?.name || "Desconocido";
	return (
		<MainLayout>
			<MenuAppLayout>
				<MenuMainContainer>
					<img
						src={LOGO_IMAGES.UNIVERSIDAD_LOGO}
						alt="Logo UNIVERSIDAD"
						style={{
							width: "100px",
							alignSelf: "center",
							justifySelf: "center",
						}}
					/>
					<MenuGrid>
						<CustomNavLink to={"home"}>Home</CustomNavLink>{" "}
						<CustomNavLink to={"create-schedule"}>
							Creacion de cronograma
						</CustomNavLink>
						<CustomNavLink to={"my-schedules"}>Mis cronogramas</CustomNavLink>
						<CustomNavLink to={"create-project-report"}>
							Crear informe de estado de proyecto
						</CustomNavLink>
						<CustomNavLink to={"manage-periods"}>
							Gestionar periodos
						</CustomNavLink>
					</MenuGrid>
					<AvatarSignOutLayout>
						<Box display="flex" alignItems="center" mb={2}>
							<Avatar
								sx={{ bgcolor: SECONDARY_COLOR_CONF, mr: 2, color: "black" }}
							>
								{name.charAt(0)}
							</Avatar>
							<Box>
								<Typography color="white" variant="body1">
									{name} {paternal_surname} {maternal_surname}
								</Typography>
								<Typography variant="body2" color="#EBFFEB">
									{userRole}
								</Typography>
								<Typography variant="body2" color="#EBFFEB">
									{email}
								</Typography>
							</Box>
							<Box>
								<IconButton onClick={handleSignOut} aria-label="delete">
									<ExitToAppIcon style={{ color: "white" }} />
								</IconButton>
							</Box>
						</Box>
					</AvatarSignOutLayout>
				</MenuMainContainer>
				<MenuDisplayContainer>
					<Outlet />
				</MenuDisplayContainer>
			</MenuAppLayout>
		</MainLayout>
	);
};

export default SharedLayoutDirector;
