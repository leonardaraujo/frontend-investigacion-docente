import styled from "styled-components";
import { PRINCIPAL_COLOR_CONF } from "../../../conf/COLORS.conf";
export const LayoutCreateSchedule = styled.div`
   height:100%;
  width:100%;
  display:grid;
  grid-template-rows:10% 10% 75% 5%;
  align-items:center;
  justify-items:center;
  padding:10px;
`;
export const CreateScheduleDisplay = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 5% 10% 75% 10%;
`;

export const ContainerTableCreateSchedule = styled.div`
height:100%;
  width:100%;
  align-items: center;
  place-self: center;
  overflow: auto;
  max-height: 650px; 
`;
export const CreateScheduleTitleSelectButtonLayout = styled.div`
    height:100%;
  width:100%;
  display:grid;
  grid-template-rows:70% 30%;
  align-items:center;
  padding:10px;
`;

export const CreateScheduleStyledInput = styled.input`
  width: 200px;
  height:30px;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 16px;
  &:focus {
    border-color:${PRINCIPAL_COLOR_CONF};
    background-color: #fff;
    outline: none;
  }
`;

export const DirectorCreateScheduleTitleInputLayout = styled.div`
    height:100%;
  width:100%;
  display:grid;
  grid-template-columns:40% 50%;
  align-items:center;
  justify-items:start;
`;

export const ScrollableTableBody = styled.div`
    max-height: 400px; /* Ajusta esta altura según sea necesario */
    overflow-y: auto;
`;
