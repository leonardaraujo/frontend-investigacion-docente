import styled from "styled-components";
import COLORS from "../../../constants/colors/COLORS";
type props = {
  $btype?: "danger" | "normal" | "success" | "ns";
};
export const StyledButton = styled.button<props>`
  border-radius: 10px;
  border: 0px;
  height: 45px;
  padding: 0px 15px 0px 15px;
  font-size: 20px;

  background-color: ${({ $btype = "normal" }) => {
    if ($btype == "danger") {
      return COLORS.RED;
    } else if ($btype == "success") {
      return COLORS.GREEN;
    } else if ($btype == "ns") {
      return "#007400";
    } else {
      return COLORS.DARK_BLUE;
    }
  }};
  color: ${({ $btype = "normal" }) => {
    if ($btype == "normal") {
      return "black";
    } else {
      return "white";
    }
  }};
  &:disabled {
    background-color: ${COLORS.GRAY_PASTEL};
    color: ${COLORS.GRAY_DARK};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
export const IconTextButton = styled.button`
  width: 200px;
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr;
  align-items: center;
  border: 0px;
  justify-items: center;
  background-color: ${COLORS.BLUE_PASTEL};
  &:hover {
    background-color: ${COLORS.BLUE_PASTEL_HOVER};
  }
  .active {
    background-color: ${COLORS.BLUE_PASTEL_HOVER};
  }
`;

export const AbsoluteBackButton = styled.button`
  position: absolute;
  width: 50px;
  height: 30px;
  border: 0px;
  margin: 10px;
  border-radius: 3px;
`;
export const FullButton = styled.button<props>`
  width: 100%;
  height: 100%;
  border: 0px;
  font-size: 20px;
  background-color: ${({ $btype = "normal" }) => {
    if ($btype == "danger") {
      return COLORS.RED;
    } else if ($btype == "success") {
      return COLORS.GREEN;
    } else {
      return COLORS.BLUE_PASTEL;
    }
  }};
  color: ${({ $btype = "normal" }) => {
    if ($btype == "normal") {
      return "white";
    } else {
      return "black";
    }
  }};
  &:disabled {
    background-color: ${COLORS.GRAY_PASTEL};
    color: linen;
    opacity: 1;
  }
`;
export const MoneyButton = styled.button`
  background-color: ${COLORS.BLUE_PASTEL};
  font-size: 20px;
  min-width: 100px;
  height: 60px;
  color: white;
`;
export const IconButtonFull = styled.button`
  display: grid;
  grid-template-columns: 20% 80%;
  border: 0px;
  justify-items: center;
  align-items: center;
  background-color: ${COLORS.BLUE_PASTEL};
  width: 100%;
  height: 100%;
  color: white;
`;
export const IconButton = styled.button`
  border: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 55px;
  height: 55px;
  color: black;
`;
export const CircularButtonAbsolute = styled.button`
  height: 120px;
  width: 120px;
  border-radius: 50%;
  z-index:100;
  position: absolute;
  right: 5px;
  top: 0px;
  background-color: red;
`;
export const UpdateButtonAbsolute = styled.button`
  height: 75px;
  width: 75px;
  border-radius: 50%;
  position: absolute;
  left: 10px;
  bottom: 10px;
  background-color: white;

  &:disabled {
    background-color: lightgray;
    color: darkgray;
    cursor: not-allowed;
    opacity: 0.3;
  }
`;
