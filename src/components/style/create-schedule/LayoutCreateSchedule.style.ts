import styled from "styled-components";
export const LayoutCreateSchedule = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 10% 90%;
  align-items: center;
  justify-items: center;
  position: relative;
`;
export const CreateScheduleDisplay = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 5% 10% 75% 10%;
`;

export const ContainerTableCreateSchedule = styled.div`
  width: 100%;
  max-height: 500px; /* Altura máxima fija */
  overflow-y: auto; /* Desplazamiento vertical */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-top: 20px;
`;
