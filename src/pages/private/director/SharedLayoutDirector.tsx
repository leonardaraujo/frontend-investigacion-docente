import { Outlet } from "react-router-dom";
import {
  MainLayout,
  MenuAppLayout,
} from "../../../components/layout/Main.layout";
import UncpLogo from "../../../assets/images/uncp_logo.webp";

import { Button } from "@mui/material";
import useUserStore from "../../../store/userStore";
import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import {
  MenuDisplayContainer,
  MenuGrid,
  MenuMainContainer,
} from "../../../components/style/Menu.style";
import { CustomNavLink } from "../../../components/style/NavLink.style";
const SharedLayoutDirector = () => {
  const { deleteUser } = useUserStore();
  const navigate = useNavigate();
  const [token, setToken] = useSessionStorage("token", "");
  const handleSignOut = () => {
    setToken("");
    deleteUser();
    navigate("/login", { replace: true });
  };
  return (
    <MainLayout>
      <MenuAppLayout>
        <MenuMainContainer>
          <img
            src={UncpLogo}
            alt="UNCP Logo"
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
            <Button onClick={handleSignOut}>Cerrar sesion</Button>
          </MenuGrid>
        </MenuMainContainer>

        <MenuDisplayContainer>
          <Outlet />
        </MenuDisplayContainer>
      </MenuAppLayout>
    </MainLayout>
  );
};

export default SharedLayoutDirector;
