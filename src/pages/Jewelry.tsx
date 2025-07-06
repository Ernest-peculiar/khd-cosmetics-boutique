import { CategoryPage } from "./CategoryPage";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const Jewelry = () => {
  const { products, loading } = useProductsByCategory("jewelry");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jewelry products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <CategoryPage
      category="jewelry"
      title="Jewelry Collection"
      description="Eleeegant and timeless pieces to complement your unique style"
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        originalPrice: product.original_price
          ? Number(product.original_price)
          : undefined,
        image: product.image,
        rating: Number(product.rating) || 0,
        reviews: product.reviews_count || 0,
        brand: product.brand,
        isOnSale: product.is_on_sale || false,
      }))}
    />
  );
};

export default Jewelry;
