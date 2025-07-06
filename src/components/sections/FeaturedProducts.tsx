import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { CartContext } from "@/components/layout/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";

export const FeaturedProducts = () => {
  const { addToCart, addToWishlist } = useContext(CartContext);
  const { toast } = useToast();
  const { products, loading } = useProducts();

  // Show the first 3 products, and the 5th product as the 4th featured (if it exists)
  let featuredProducts = products.slice(0, 3);
  if (products.length > 4) {
    featuredProducts = [...featuredProducts, products[4]];
  } else if (products.length > 3) {
    featuredProducts = [...featuredProducts, products[3]];
  }

  const handleAddToCart = (product: any) => {
    console.log("Featured products - adding to cart:", product);
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (product: any) => {
    console.log("Featured products - adding to wishlist:", product);
    addToWishlist(product);
    toast({
      title: "Added to wishlist!",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  // Debug: log all product names to help you find the correct ones
  console.log(
    "Available product names:",
    products.map((p) => p.name)
  );

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Featured
              <span className="block bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked bestsellers loved by thousands of customers worldwide
            </p>
          </div>
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured
            <span className="block bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked bestsellers loved by thousands of customers worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-rose-200 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Image */}
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Sale Badge */}
                  {product.is_on_sale && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Sale
                    </div>
                  )}
                </div>
              </Link>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-8 right-8 bg-white/80 hover:bg-white text-gray-600 hover:text-rose-600"
                onClick={() => handleAddToWishlist(product)}
              >
                <Heart className="w-4 h-4" />
              </Button>

              {/* Product Info */}
              <div className="space-y-3">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0)
                            ? "text-amber-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating || 0} ({product.reviews_count || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{Number(product.price).toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-gray-500 line-through">
                      ₦{Number(product.original_price).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white group transition-all duration-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
