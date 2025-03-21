import { Outlet } from "react-router-dom";
import { MainLayout, MenuAppLayout } from "./layout/Main.layout";
import UncpLogo from "../assets/images/uncp_logo.webp";
import {
	AvatarSignOutLayout,
	MenuDisplayContainer,
	MenuGrid,
	MenuMainContainer,
} from "./style/Menu.style";
import { CustomNavLink } from "./style/NavLink.style";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import useUserStore from "../store/userStore";
import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../constants/data/VariablesRoles";
import { LOGO_IMAGES } from "../conf/IMAGES.conf";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { SECONDARY_COLOR_CONF } from "../conf/COLORS.conf";
const SharedLayout = () => {
	const { rol_id, email, name, paternal_surname, maternal_surname } =
		useUserStore();
	const { deleteUser } = useUserStore();
	const navigate = useNavigate();
	const [token, setToken] = useSessionStorage("token", "");
	const handleSignOut = () => {
		console.log(token);
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
						<CustomNavLink to={"my-investigations"}>
							Mis investigaciones
						</CustomNavLink>
						<CustomNavLink to={"advances"}>
							Presentacion de avances
						</CustomNavLink>
						<CustomNavLink to={"final-present"}>
							Presentacion de entrega final
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

export default SharedLayout;
