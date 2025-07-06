
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { CartContext } from "@/components/layout/Navigation";
import { useToast } from "@/hooks/use-toast";

export const FeaturedProducts = () => {
  const { addToCart, addToWishlist } = useContext(CartContext);
  const { toast } = useToast();

  const products = [
    {
      id: 1,
      name: "Radiance Glow Serum",
      price: 35000,
      originalPrice: 47500,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      reviews: 124,
      brand: "Glow Beauty"
    },
    {
      id: 2,
      name: "Luxury Hair Extensions",
      price: 119000,
      originalPrice: 158000,
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.9,
      reviews: 87,
      brand: "HairLux"
    },
    {
      id: 3,
      name: "Gentle Daily Moisturizer",
      price: 9900,
      originalPrice: 13900,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      reviews: 203,
      brand: "SkinCare Pro"
    },
    {
      id: 4,
      name: "Signature Perfume Collection",
      price: 59500,
      originalPrice: 79000,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.6,
      reviews: 156,
      brand: "Luxe Scents"
    }
  ];

  const handleAddToCart = (product: any) => {
    console.log('Featured products - adding to cart:', product);
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (product: any) => {
    console.log('Featured products - adding to wishlist:', product);
    addToWishlist(product);
    toast({
      title: "Added to wishlist!",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

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
          {products.map((product, index) => (
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
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Sale
                  </div>
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
                          i < Math.floor(product.rating)
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
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
