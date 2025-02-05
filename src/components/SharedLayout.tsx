import { Outlet } from "react-router-dom";
import { MainLayout, MenuAppLayout } from "./layout/Main.layout";
import UncpLogo from "../assets/images/uncp_logo.webp";
import {
  MenuDisplayContainer,
  MenuGrid,
  MenuMainContainer,
} from "./style/Menu.style";
import { CustomNavLink } from "./style/NavLink.style";
import { Button } from "@mui/material";
import useUserStore from "../store/userStore";
import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
const SharedLayout = () => {
  const { deleteUser } = useUserStore();
  const navigate = useNavigate();
  const [token, setToken] = useSessionStorage("token", "");
  const handleSignOut = () => {
    console.log(token);
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
            <CustomNavLink to={"my-investigations"}>
              Mi investigacion
            </CustomNavLink>
            <CustomNavLink to={"advances"}>
              Presentacion de avances
            </CustomNavLink>
            <CustomNavLink to={"final-present"}>
              Presentacion de avance final
            </CustomNavLink>
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

export default SharedLayout;
