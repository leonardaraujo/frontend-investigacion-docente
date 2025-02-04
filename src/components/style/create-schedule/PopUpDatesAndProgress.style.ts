import styled from "styled-components";

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Color negro con opacidad del 50% */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que el overlay esté por encima de otros elementos */
`;

export const PopUpContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001; /* Asegura que el popup esté por encima del overlay */
`;
