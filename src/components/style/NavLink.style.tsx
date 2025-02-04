import { NavLink } from "react-router-dom";
import styled from "styled-components";
export const CustomNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;

  &:hover {
    color: #ff6347; /* Cambia este color al que prefieras */
  }

  &.active {
    font-weight: bold;
  }
`;