import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { PRODUCT, Product } from "@/constants/Product";
import { Image } from "expo-image";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import CartControls from "@/components/CartControls";
import { LinearGradient } from "expo-linear-gradient";
import { formatPrice } from "@/constants";

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
  specs,
  quantity,
}: Product) => {
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <ScrollView
        style={{ padding: 16 }}
        contentContainerStyle={{ paddingBottom: 116 + bottom }}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView>
          <View
            style={[styles.imageContainer, { backgroundColor: text + "05" }]}
          >
            <Image
              source={image}
              style={{ width: "100%", height: 300 }}
              contentFit="contain"
            />
          </View>
          <View style={styles.productDetails}>
            <ThemedText type="title">{name}</ThemedText>
            {description && (
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: 15, opacity: 0.7 }}
              >
                {description}
              </ThemedText>
            )}
            <ThemedText
              type="defaultSemiBold"
              style={{ fontSize: 20, letterSpacing: -0.5, lineHeight: 30 }}
            >
              {formatPrice(price)}
            </ThemedText>
            <View
              style={[styles.seperator, { backgroundColor: text + "10" }]}
            />
            {specs && Object.keys(specs).length > 0 && (
              <View>
                <View style={styles.specHeader}>
                  <ThemedText
                    type="title"
                    style={{ fontSize: 19, lineHeight: 19 }}
                  >
                    Specifications
                  </ThemedText>
                </View>
                <View style={styles.specs}>
                  {Object.entries(specs).map(([key, value], index) => (
                    <View
                      key={index}
                      style={[styles.spec, { backgroundColor: text + "05" }]}
                    >
                      <ThemedText>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </ThemedText>
                      <ThemedText type="defaultSemiBold">{value}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
      <LinearGradient
        locations={[0, 0.28]}
        colors={[background + "00", background] as const}
        style={[styles.actionBar, { paddingVertical: bottom }]}
      >
        <CartControls price={price} maxQuantity={quantity} image={image} />
      </LinearGradient>
    </>
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
    maxHeight: 480,
    aspectRatio: 1.1,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
  },
  productDetails: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    flex: 1,
  },
  seperator: {
    height: 1,
    width: "100%",
    marginVertical: 12,
  },
  specHeader: {
    height: 30,
    justifyContent: "center",
  },
  specs: {
    justifyContent: "space-between",
    marginVertical: 8,
  },
  spec: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    padding: 16,
    borderRadius: 12,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 36,
  },
});
