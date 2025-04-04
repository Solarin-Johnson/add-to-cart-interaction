import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  PixelRatio,
  Platform,
  LayoutChangeEvent,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "./ThemedText";
import Feather from "@expo/vector-icons/Feather";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CartIcon } from "./ui/Icons";
import { formatPrice, SPRING_CONFIG } from "@/constants";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedView } from "./ThemedView";
import { Image } from "expo-image";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BALL_SIZE = 38;
const IS_WEB = Platform.OS === "web";

interface CartControlsProps {
  price: number;
  initialQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  image?: string;
}

const PULSE_SPRING = {
  damping: 10,
  stiffness: 200,
  mass: 1,
  overshootClamping: false,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};

function ButtonExit() {
  "worklet";

  const animations = {
    transform: [
      {
        scale: withTiming(0, { duration: 300 }),
      },
      {
        translateY: withTiming(-400, { duration: 500 }),
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

function ButtonEnter() {
  "worklet";

  const animations = {
    transform: [
      {
        scale: withTiming(1, { duration: 300 }),
      },
      {
        translateY: withTiming(0, { duration: 300 }),
      },
    ],
    opacity: withTiming(1, { duration: 100 }),
  };

  const initialValues = {
    transform: [
      {
        scale: 0.3,
      },
      {
        translateY: -120,
      },
    ],
    opacity: 0,
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
  image,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const { width: windowWidth } = useWindowDimensions();
  const [cartedQuantity, setCartedQuantity] = useState<number>(initialQuantity);
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const [originStart, setOriginStart] = useState<number>(0);
  const [originEnd, setOriginEnd] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const controlsRef = useRef<View>(null);
  const cartRef = useRef<View>(null);
  const cartPulse = useSharedValue(1);
  const cartedSharedValue = useSharedValue(cartedQuantity);
  const prevCartedQuantityRef = useRef(cartedQuantity);

  const isMaxQuantityReached = quantity >= maxQuantity;
  const isMinQuantityReached = quantity <= 0;

  const handleIncrement = useCallback(() => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  }, [quantity, onQuantityChange]);

  const handleDecrement = useCallback(() => {
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  }, [quantity, onQuantityChange]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.measure((x, y, width, height, pageX, pageY) => {
        setOriginStart(pageX + width / 2);
      });
    }
    if (cartRef.current) {
      cartRef.current.measure((x, y, width, height, pageX, pageY) => {
        setOriginEnd(pageX + width / 2.8 - BALL_SIZE / 2);
      });
    }
  }, [quantity, windowWidth]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const timeoutDuration = 300;

    if (quantity > cartedQuantity) {
      const startTime = Date.now();
      timeoutId = setTimeout(() => {
        setCartedQuantity(quantity);
      }, timeoutDuration);

      return () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 100 && timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    } else {
      setCartedQuantity(quantity);
      return () => {};
    }
  }, [quantity, cartedQuantity]);

  useEffect(() => {
    if (cartedQuantity > 0 && cartedQuantity > prevCartedQuantityRef.current) {
      cartPulse.value = withSpring(1.14, PULSE_SPRING, () => {
        cartPulse.value = withSpring(1, PULSE_SPRING);
      });
    }
    prevCartedQuantityRef.current = cartedQuantity;
  }, [cartedQuantity]);

  const cartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: cartPulse.value,
        },
      ],
    };
  });

  useEffect(() => {
    "worklet";
    cartedSharedValue.value = cartedQuantity;
  }, [cartedQuantity, cartedSharedValue]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width: layoutWidth } = event.nativeEvent.layout;
    setWidth(layoutWidth);
  }, []);

  return (
    <View style={styles.cartControls} onLayout={onLayout}>
      {quantity > 0 && (
        <>
          {Array.from({ length: quantity }).map((_, index) => (
            <Ball
              key={index}
              {...{ originStart, originEnd }}
              image={image}
              originWidth={width}
            />
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
            onLongPress={() => setQuantity(0)}
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
            onLongPress={() => setQuantity(maxQuantity)}
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
              entering={ButtonEnter}
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
        <Animated.View style={cartAnimatedStyle}>
          <CartIcon
            size={BALL_SIZE}
            color={text}
            style={{ opacity: 0.8 }}
            text={cartedQuantity}
          />
        </Animated.View>
      </View>
    </View>
  );
};

interface BallProps {
  originStart?: number;
  originEnd?: number;
  originWidth?: number;
  image?: string;
  onFinish?: () => void;
}

const Ball = memo(
  ({ originStart = 0, originEnd = 0, originWidth = 0, image }: BallProps) => {
    const { width } = useWindowDimensions();
    const angle = useSharedValue(0);
    const opacity = useSharedValue(1);
    const webCord = IS_WEB ? (width - originWidth) / 2 - BALL_SIZE / 3 : 0;
    useAnimatedReaction(
      () => angle.value,
      (currentAngle) => {
        if (currentAngle >= Math.PI * 0.8) {
          opacity.value = withTiming(0, { duration: 250 });
        }
      }
    );

    useEffect(() => {
      angle.value = withSpring(Math.PI, SPRING_CONFIG);
    }, []);

    const ballConstants = useMemo(() => {
      const ballRadius = BALL_SIZE / 2;
      const dx = originEnd - originStart;
      const radiusX = (dx + BALL_SIZE) / 2;
      const curvatureFactor = 1.5;

      const radiusY = radiusX * curvatureFactor;
      const centerX = originStart + dx / 2;
      const baseBottom = 20;
      const centerY = baseBottom + ballRadius;
      return { ballRadius, radiusX, radiusY, centerX, centerY };
    }, [originStart, originEnd, BALL_SIZE, webCord]);

    const animatedStyle = useAnimatedStyle(() => {
      const { ballRadius, radiusX, radiusY, centerX, centerY } = ballConstants;
      const left =
        centerX - radiusX * Math.cos(angle.value) - ballRadius - webCord;
      const bottom = centerY + radiusY * Math.sin(angle.value) - ballRadius;

      return {
        position: "absolute",
        left,
        bottom,
        opacity: opacity.value,
      };
    });

    return (
      <Animated.View style={[styles.balls, animatedStyle]}>
        <Image
          source={image}
          style={{
            width: BALL_SIZE,
            height: BALL_SIZE,
          }}
          contentFit="contain"
        />
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  cartControls: {
    paddingBottom: 10 + (IS_WEB ? 6 : 0),
    paddingTop: IS_WEB ? 36 : 10,
    paddingHorizontal: PixelRatio.getPixelSizeForLayoutSize(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: PixelRatio.getPixelSizeForLayoutSize(3),
    width: "100%",
    maxWidth: IS_WEB ? 420 : 450,
    alignSelf: "center",
    position: "relative",
    userSelect: "none",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 55,
    paddingVertical: IS_WEB ? 4 : 0,
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
    gap: 4,
    width: 100,
    opacity: 0.7,
  },
  total: {
    fontSize: 19,
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
    backgroundColor: "#ffffff",
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CartControls;
