import styled from "styled-components";

export const CreateScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const TableHead = styled.thead`
  background-color: #006600;
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
