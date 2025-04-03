import React from "react";
import Svg, { Path } from "react-native-svg";

export interface IconProps {
  color?: string;
  size?: number;
}

export const CartIcon: React.FC<IconProps> = ({
  color = "currentColor",
  size = 24,
}) => {
  return (
    <Svg width={size} height={size * 0.75} viewBox="0 0 22 18" fill="none">
      <Path
        d="M18 8L14 1M1 8H21M2.5 8L4.1 15.4C4.1935 15.8586 4.44485 16.2698 4.81028 16.5621C5.17572 16.8545 5.63211 17.0094 6.1 17H15.9C16.3679 17.0094 16.8243 16.8545 17.1897 16.5621C17.5552 16.2698 17.8065 15.8586 17.9 15.4L19.6 8M4 8L8 1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
