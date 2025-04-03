import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { PRODUCT, Product } from "@/constants/Product";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ProductDetails {...PRODUCT} />
    </ThemedView>
  );
}

const ProductDetails = ({
  id,
  name,
  price,
  image,
  description,
  options,
}: Product) => {
  const formatedPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return formatter.format(price);
  };
  return (
    <SafeAreaView style={{ padding: 16 }}>
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={{ width: "100%", height: 200 }}
          contentFit="contain"
        />
      </View>
      <View style={styles.productDetails}>
        <ThemedText type="title" style={{ fontSize: 28 }}>
          {name}
        </ThemedText>
        {description && (
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 15, opacity: 0.7, lineHeight: 20 }}
          >
            {description}
          </ThemedText>
        )}
        <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
          {formatedPrice(price)}
        </ThemedText>
        {options && Object.keys(options).length > 0 && (
          <View style={{ marginTop: 8 }}>
            <ThemedText style={{ fontWeight: "bold" }}>Options:</ThemedText>
            {Object.entries(options).map(([key, value], index) => (
              <View key={index} style={{ flexDirection: "row", marginLeft: 8 }}>
                <ThemedText style={{ fontWeight: "bold" }}>
                  • {key}:{" "}
                </ThemedText>
                <ThemedText>{value}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1.2,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000006",
    padding: 8,
    borderRadius: 16,
  },
  productDetails: {
    marginTop: 16,
    padding: 8,
    gap: 10,
    flex: 1,
  },
});
