import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { ThemedText } from "./ThemedText";
import Feather from "@expo/vector-icons/Feather";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CartIcon } from "./ui/Icons";
import { formatPrice } from "@/constants";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedView } from "./ThemedView";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 80,
  mass: 1,
  overshootClamping: true,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};

interface CartControlsProps {
  price: number;
  initialQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

function ButtonExit(values: any) {
  "worklet";

  const animations = {
    transform: [
      {
        scale: withTiming(0, { duration: 300 }),
      },
      {
        translateY: withTiming(-450, { duration: 500 }),
      },
    ],
    opacity: withDelay(200, withTiming(0, { duration: 0 })),
  };

  const initialValues = {
    transform: [
      {
        scale: 1,
      },
      {
        translateY: 0,
      },
    ],
    opacity: 1,
  };

  return {
    initialValues,
    animations,
  };
}

const CartControls: React.FC<CartControlsProps> = ({
  price,
  initialQuantity = 0,
  onQuantityChange,
  maxQuantity = 99,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [cartedQuantity, setCartedQuantity] = useState<number>(initialQuantity);
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const [originStart, setOriginStart] = useState<number>(0);
  const [originEnd, setOriginEnd] = useState<number>(0);
  const controlsRef = useRef<View>(null);
  const cartRef = useRef<View>(null);

  const isMaxQuantityReached = quantity >= maxQuantity;
  const isMinQuantityReached = quantity <= 0;

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  useEffect(() => {
    setCartedQuantity(quantity);
  }, [quantity]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.measure((x, y, width, height, pageX, pageY) => {
        setOriginStart(pageX + width / 2);
      });
    }
    if (cartRef.current) {
      cartRef.current.measure((x, y, width, height, pageX, pageY) => {
        setOriginEnd(pageX + 26 - BALL_SIZE / 2);
      });
    }
  }, [controlsRef, cartRef]);

  return (
    <View style={styles.cartControls}>
      {quantity > 0 && (
        <>
          {Array.from({ length: quantity }).map((_, index) => (
            <Ball key={index} {...{ originStart, originEnd }} />
          ))}
        </>
      )}

      <ThemedView style={{ flex: 1 }}>
        <View
          ref={controlsRef}
          style={[
            styles.quantityControls,
            {
              backgroundColor: text + "10",
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleDecrement}
            disabled={isMinQuantityReached}
            style={[
              styles.button,
              isMinQuantityReached && styles.disabledButton,
            ]}
          >
            <ThemedText style={styles.buttonText}>
              <Feather name="minus" size={21} />
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.quantityTextContainer}>
            <ThemedText type="defaultSemiBold" style={styles.quantityText}>
              {quantity}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={handleIncrement}
            disabled={isMaxQuantityReached}
            style={[
              styles.button,
              isMaxQuantityReached && styles.disabledButton,
            ]}
          >
            <ThemedText style={styles.buttonText}>
              <Feather name="plus" size={21} />
            </ThemedText>
          </TouchableOpacity>

          {quantity === 0 && (
            <AnimatedPressable
              style={[styles.overlay, { backgroundColor: text }]}
              onPress={handleIncrement}
              exiting={ButtonExit}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: 17, color: background }}
              >
                Add
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={{ opacity: 0.6, fontSize: 16, color: background }}
              >
                {formatPrice(price)}
              </ThemedText>
            </AnimatedPressable>
          )}
        </View>
      </ThemedView>
      <View style={styles.cart} ref={cartRef}>
        <CartIcon size={28} color={text} style={{ opacity: 0.8 }} />
        <ThemedText type="defaultSemiBold" style={styles.total}>
          {cartedQuantity}
        </ThemedText>
      </View>
    </View>
  );
};

interface BallProps {
  originStart?: number;
  originEnd?: number;
}

const BALL_SIZE = 35;

const Ball = ({ originStart = 0, originEnd = 0 }: BallProps) => {
  const ballRadius = BALL_SIZE / 2;

  const dx = originEnd - originStart;

  const radiusX = (dx + BALL_SIZE) / 2;

  const curvatureFactor = 1.7;
  const radiusY = radiusX * curvatureFactor;

  const centerX = originStart + dx / 2;
  const baseBottom = 20;
  const centerY = baseBottom + ballRadius;

  const angle = useSharedValue(0);
  const opacity = useSharedValue(1);

  useAnimatedReaction(
    () => angle.value,
    (currentAngle) => {
      "worklet";
      if (currentAngle >= Math.PI * 0.9) {
        opacity.value = withTiming(0, { duration: 200 });
      }
    }
  );

  useEffect(() => {
    angle.value = withSpring(Math.PI, SPRING_CONFIG);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    // Calculate left and bottom so the ball's center follows the arc.
    const left = centerX - radiusX * Math.cos(angle.value) - ballRadius;
    const bottom = centerY + radiusY * Math.sin(angle.value) - ballRadius;
    return {
      position: "absolute",
      left,
      bottom,
      opacity: opacity.value,
    };
  });

  return <Animated.View style={[styles.balls, {}, animatedStyle]} />;
};

const styles = StyleSheet.create({
  cartControls: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // gap: 10,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    position: "relative",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 52,
    borderRadius: 50,
    paddingHorizontal: 12,
    overflow: "hidden",
    flex: 1,
  },
  button: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    // paddingHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    opacity: 0.7,
  },
  quantityTextContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 19,
    paddingHorizontal: 15,
  },
  cart: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: 110,
    opacity: 0.7,
  },
  total: {
    fontSize: 18,
    width: 21,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 50,
  },

  balls: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: 8,
    backgroundColor: "red",
    // opacity: 0.2,
  },
});

export default CartControls;
