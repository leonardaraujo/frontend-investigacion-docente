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
width:500px;
height:200px;
  background-color: white;
  display:grid;
  gap:10px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001; /* Asegura que el popup esté por encima del overlay */
`;

export const OverlayProgress = styled.div`
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

export const PopUpContainerProgress = styled.div`
width:650px;
min-height:300px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
`;

export const ProgressContainerLayout = styled.div`
width:100%;
height:100%;
  display:grid;
  grid-template-rows:50px 50px 4fr 1fr;
  align-items:center;
  gap:10px;
`;
