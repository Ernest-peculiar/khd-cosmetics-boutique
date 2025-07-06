
import { CategoryPage } from "./CategoryPage";

const products = [
  {
    id: 1,
    name: "Gentle Baby Moisturizer",
    price: 24.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 203,
    brand: "BabyPure",
    isOnSale: true
  },
  {
    id: 2,
    name: "Organic Baby Oil",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 156,
    brand: "NatureBaby"
  },
  {
    id: 3,
    name: "Baby Sunscreen SPF 50",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 89,
    brand: "SunSafe"
  }
];

const BabySkincare = () => {
  return (
    <CategoryPage
      category="baby-skincare"
      title="Baby Skincare"
      description="Gentle, natural care products specially formulated for delicate baby skin"
      products={products}
    />
  );
};

export default BabySkincare;
