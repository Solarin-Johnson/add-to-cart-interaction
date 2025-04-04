import React from "react";
import { PixelRatio } from "react-native";
import Svg, { G, Path, Text } from "react-native-svg";
export interface IconProps {
  color?: string;
  size?: number;
  style?: React.ComponentProps<typeof Svg>["style"];
  text?: string | number;
  [key: string]: any;
}

export const CartIcon: React.FC<IconProps> = ({
  color = "currentColor",
  size = 24,
  style,
  text,
  ...otherProps
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 22 20"
      fill="none"
      style={style}
      {...otherProps}
    >
      <G>
        <Path
          d="M16 6L14 1.5M4 6L6 1.5M1.5 6.5L3.1 15.4C3.1935 15.8586 3.44485 16.2698 3.81028 16.5621C4.17572 16.8545 4.63211 17.0094 5.1 17H14.9C15.3679 17.0094 15.8243 16.8545 16.1897 16.5621C16.5552 16.2698 16.8065 15.8586 16.9 15.4L18.5 6.5H10H6H3.75H1.5Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Text
          x="46%"
          y="55%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill={color}
          fontSize={PixelRatio.getPixelSizeForLayoutSize(size * 0.02) + 6}
          fontWeight={"600"}
        >
          {text}
        </Text>
      </G>
    </Svg>
  );
};
