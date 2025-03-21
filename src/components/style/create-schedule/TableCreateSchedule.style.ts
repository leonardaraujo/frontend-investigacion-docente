import styled from "styled-components";
import { PRINCIPAL_COLOR_CONF } from "../../../conf/COLORS.conf";

export const CreateScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: ${PRINCIPAL_COLOR_CONF};
`;

export const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const TableRow = styled.tr``;

interface TableHeaderProps {
  width?: string;
}

export const TableHeader = styled.th<TableHeaderProps>`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
  color: white;
  width: ${(props) => props.width || "auto"};
`;

export const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
  color: #333;
`;
