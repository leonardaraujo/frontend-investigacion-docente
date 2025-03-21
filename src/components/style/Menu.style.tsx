import styled from "styled-components";
import {NAVBAR_PRINCIPAL_COLOR_CONF} from "../../conf/COLORS.conf";
export const MenuMainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${NAVBAR_PRINCIPAL_COLOR_CONF};
  display: grid;
  grid-template-rows: 20% 68% 12%;
`;
export const MenuGrid = styled.div`
  width: 100%;
  height: 600px;
  padding: 20px;
  display: grid;
  grid-template-rows: 10% 10%;
  grid-auto-rows: 10%;
`;

export const MenuDisplayContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const AvatarSignOutLayout = styled.div`
  display:grid;
  padding: 20px;
  align-items:center;
`;
