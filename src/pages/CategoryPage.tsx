import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Grid, List, Heart, ShoppingCart, Star, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useLikes } from "@/hooks/useLikes";
import type { Product as SupabaseProduct } from "@/integrations/supabase/types";

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
  products: SupabaseProduct[];
}

type Product = SupabaseProduct;

export const CategoryPage = ({
  category,
  title,
  description,
  products,
}: CategoryPageProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { addToCart } = useCart();
  const { toggleLike } = useLikes();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const brands = Array.from(new Set(products.map((p) => p.brand)));

  // Filter and sort products
  React.useEffect(() => {
    let filtered = products.filter((product) => {
      const withinPriceRange =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesRating =
        selectedRatings.length === 0 ||
        selectedRatings.some((rating) => product.rating >= rating);

      return withinPriceRange && matchesBrand && matchesRating;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
  }, [products, priceRange, selectedBrands, selectedRatings, sortBy]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands((prev) => [...prev, brand]);
    } else {
      setSelectedBrands((prev) => prev.filter((b) => b !== brand));
    }
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings((prev) => [...prev, rating]);
    } else {
      setSelectedRatings((prev) => prev.filter((r) => r !== rating));
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (product: Product) => {
    toggleLike(product);
    toast({
      title: "Wishlist updated!",
      description: `${product.name} has been added to or removed from your wishlist.`,
    });
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Filters</h3>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Price Range */}
        <div className="space-y-3 mb-4">
          <h4 className="font-medium text-sm">Price Range</h4>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-sm">Brands</h4>
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) =>
                  handleBrandChange(brand, checked as boolean)
                }
              />
              <label htmlFor={brand} className="text-xs cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Rating</h4>
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={(checked) =>
                  handleRatingChange(rating, checked as boolean)
                }
              />
              <label
                htmlFor={`rating-${rating}`}
                className="flex items-center text-xs cursor-pointer"
              >
                <div className="flex mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rating
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                & Up
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Category Header */}
      <section className="bg-gradient-to-r from-rose-100 to-amber-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <div className="w-64 flex-shrink-0">
              <FilterSection />
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                )}
                <span className="text-gray-600 text-sm">1 item</span>
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {isMobile && showFilters && (
              <div className="mb-6 animate-fade-in">
                <FilterSection />
              </div>
            )}

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-lg border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all duration-300 overflow-hidden ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      viewMode === "list"
                        ? "w-48 h-48 flex-shrink-0"
                        : "aspect-square"
                    }`}
                  >
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {product.isOnSale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Sale
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8"
                      onClick={() => handleAddToWishlist(product)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div
                    className={`p-4 flex flex-col ${
                      viewMode === "list" ? "flex-1" : ""
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-sm text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating)
                                  ? "text-amber-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₦{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₦{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-sm py-2"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
