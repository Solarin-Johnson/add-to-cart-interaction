import React from "react";
import Svg, { Path } from "react-native-svg";
export interface IconProps {
  color?: string;
  size?: number;
  style?: React.ComponentProps<typeof Svg>["style"];
  [key: string]: any; // Allow for other props
}

export const CartIcon: React.FC<IconProps> = ({
  color = "currentColor",
  size = 24,
  style,
  ...otherProps
}) => {
  return (
    <Svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 22 18"
      fill="none"
      style={style}
      {...otherProps}
    >
      <Path
        d="M16 6L14 1.5M4 6L6 1.5M1.5 6.5L3.1 14.4C3.1935 14.8586 3.44485 15.2698 3.81028 15.5621C4.17572 15.8545 4.63211 16.0094 5.1 16H14.9C15.3679 16.0094 15.8243 15.8545 16.1897 15.5621C16.5552 15.2698 16.8065 14.8586 16.9 14.4L18.5 6.5H10H6H3.75H1.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
