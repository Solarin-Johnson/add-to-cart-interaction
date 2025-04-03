import React, { useEffect, useState } from "react";
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
interface CartControlsProps {
  price: number;
  initialQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
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

  const totalPrice = (price * quantity).toFixed(2);

  return (
    <View style={styles.cartControls}>
      <View
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
          style={[styles.button, isMinQuantityReached && styles.disabledButton]}
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
          style={[styles.button, isMaxQuantityReached && styles.disabledButton]}
        >
          <ThemedText style={styles.buttonText}>
            <Feather name="plus" size={21} />
          </ThemedText>
        </TouchableOpacity>

        <Pressable style={[styles.overlay, { backgroundColor: text }]}>
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 18, color: background }}
          >
            Add
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={{ opacity: 0.6, fontSize: 17, color: background }}
          >
            {formatPrice(price)}
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.cart}>
        <CartIcon size={25} color={text} />
        <ThemedText type="defaultSemiBold" style={styles.total}>
          {cartedQuantity}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartControls: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 58,
    borderRadius: 50,
    paddingHorizontal: 12,
    flex: 1,
    overflow: "hidden",
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
    width: 120,
    opacity: 0.7,
  },
  total: {
    fontSize: 17,
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
  },
});

export default CartControls;
