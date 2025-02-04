import styled from "styled-components";
type TextProps = {
  size?: "small" | "medium" | "large" | "xl" | "xxl";
  $wordColor?: string;
};

type TitleProps = {
  $wordColor?: "black" | "white";
};
const textSizes = {
  small: 10,
  medium: 20,
  large: 25,
  xl: 30,
  xxl: 35,
};
export const Text = styled.p<TextProps>`
  font-size: ${({ size = "medium" }) => {
    if (size == "small") {
      return `${textSizes.small}px`;
    } else if (size == "large") {
      return `${textSizes.large}px`;
    } else if (size == "xl") {
      return `${textSizes.xl}px`;
    } else if (size == "xxl") {
      return `${textSizes.xxl}px`;
    } else {
      return `${textSizes.medium}px`;
    }
  }};
  color: ${({ $wordColor = "white" }) => {
    return $wordColor;
  }};
`;
export const Title = styled.p<TitleProps>`
  font-size: 35px;
  font-weight: bold;
  justify-self: center;
  color: ${({ $wordColor = "black" }) => {
    if ($wordColor == "black") {
      return `black`;
    } else if ($wordColor == "white") {
      return `white`;
    }
  }};
`;
export const TextInherit = styled.p<TextProps>`
  font-size: ${({ size = "medium" }) => {
    if (size == "small") {
      return `${textSizes.small}px`;
    } else if (size == "large") {
      return `${textSizes.large}px`;
    } else {
      return `${textSizes.medium}px`;
    }
  }};
  color: inherit;
`;
