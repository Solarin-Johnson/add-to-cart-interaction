export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  specs: {
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
  specs: {
    storage: "256GB",
    connectivity: "Wi-Fi only",
    material: "premium metal alloy",
  },
  image: require("../assets/images/apple-vision-pro.webp"),
  category: "wearables",
  quantity: 12,
  inStock: true,
};
