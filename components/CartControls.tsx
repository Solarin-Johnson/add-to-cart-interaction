import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const totalPrice = (price * quantity).toFixed(2);

  return (
    <View style={styles.cartControls}>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={quantity <= 1}
          style={[styles.button, quantity <= 1 && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity onPress={handleIncrement} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.priceDisplay}>
        <Text style={styles.priceText}>Total: ${totalPrice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartControls: {
    padding: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#b3d1e6",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    paddingHorizontal: 15,
  },
  priceDisplay: {
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartControls;
