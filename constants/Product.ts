export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  options: {
    [key: string]: string | number | boolean;
  };
  image?: string;
  category?: string;
  inStock?: boolean;
  quantity?: number;
}

export const PRODUCT: Product = {
  id: "prod-vision-pro",
  name: "Apple Vision Pro",
  price: 3499.99,
  description:
    "Apple's revolutionary spatial computing device with advanced mixed reality capabilities",
  options: {
    storage: "256GB",
    material: "premium metal alloy",
    connectivity: "Wi-Fi only",
  },
  image: require("../assets/images/apple-vision-pro.webp"),
  category: "wearables",
  inStock: true,
};
