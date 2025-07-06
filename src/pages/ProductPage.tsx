import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation, CartContext } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Product = Tables<"products">;

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist } = useContext(CartContext);
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [paystackEmail, setPaystackEmail] = useState("");
  const [paystackPhone, setPaystackPhone] = useState("");
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [paystackSuccess, setPaystackSuccess] = useState(false);
  const [paystackScriptLoaded, setPaystackScriptLoaded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Add Paystack script to window if not present
    if (typeof window !== "undefined" && !(window as any).PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => setPaystackScriptLoaded(true);
      document.body.appendChild(script);
    } else if ((window as any).PaystackPop) {
      setPaystackScriptLoaded(true);
    }
  }, []);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h1>
          <Button onClick={() => navigate("/")}>Go back to home</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartProduct = {
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
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    const wishlistProduct = {
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
    };

    addToWishlist(wishlistProduct);
    toast({
      title: "Added to wishlist!",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    toast({
      title: "Rating submitted!",
      description: `You rated this product ${rating} stars.`,
    });
  };

  // Mock additional images - in a real app, products would have multiple images
  const productImages = [product.image, product.image, product.image];

  const productPrice = Number(product.price);
  const productOriginalPrice = product.original_price
    ? Number(product.original_price)
    : null;

  // Paystack payment handler
  const handlePaystackPayment = () => {
    setPaystackLoading(true);
    const handler =
      (window as any).PaystackPop &&
      (window as any).PaystackPop.setup({
        key: "pk_live_c987a68a6041457c9405d79429d1ad7f39ecaa3f",
        email: paystackEmail,
        amount: Number(product.price) * quantity * 100, // kobo
        currency: "NGN",
        ref: `KHD-${product.id}-${Date.now()}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Phone Number",
              variable_name: "phone",
              value: paystackPhone,
            },
            {
              display_name: "Product",
              variable_name: "product",
              value: product.name,
            },
            {
              display_name: "Quantity",
              variable_name: "quantity",
              value: quantity,
            },
          ],
        },
        callback: function (response: any) {
          setPaystackLoading(false);
          setPaystackSuccess(true);
          toast({
            title: "Payment successful!",
            description: `Your payment for ${quantity} x ${product.name} was successful. Ref: ${response.reference}`,
          });
          setTimeout(() => {
            setPaystackOpen(false);
            setPaystackSuccess(false);
            setPaystackEmail(""); // Clear email
            setPaystackPhone(""); // Clear phone
          }, 1000); // Close modal and clear fields after 1s
        },
        onClose: function () {
          setPaystackLoading(false);
        },
      });
    if (handler) handler.openIframe();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 overflow-hidden rounded-lg border-2 ${
                    selectedImageIndex === index
                      ? "border-rose-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(Number(product.rating) || 0)
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating || 0} ({product.reviews_count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₦{productPrice.toLocaleString()}
                </span>
                {productOriginalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₦{productOriginalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive">
                      {Math.round(
                        (1 - productPrice / productOriginalPrice) * 100
                      )}
                      % OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="px-4 py-2">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" onClick={handleAddToWishlist}>
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            <div className="mt-4">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white"
                onClick={() => setPaystackOpen(true)}
                disabled={!paystackScriptLoaded}
              >
                {paystackScriptLoaded ? "Buy Now" : "Loading payment..."}
              </Button>
            </div>

            {/* Paystack Modal */}
            <Dialog open={paystackOpen} onOpenChange={setPaystackOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Instant Paystack Payment</DialogTitle>
                </DialogHeader>
                {paystackSuccess ? (
                  <div className="text-green-600 text-center font-semibold py-8">
                    Payment successful!
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setPaystackOpen(false); // Close the modal immediately
                      setTimeout(() => {
                        handlePaystackPayment(); // Then open Paystack payment
                      }, 300); // Small delay to allow modal to close smoothly
                    }}
                    className="space-y-4"
                  >
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={paystackEmail}
                      onChange={(e) => setPaystackEmail(e.target.value)}
                      required
                      disabled={paystackLoading}
                    />
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={paystackPhone}
                      onChange={(e) => setPaystackPhone(e.target.value)}
                      required
                      disabled={paystackLoading}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-rose-500 text-white"
                      disabled={
                        paystackLoading || !paystackEmail || !paystackPhone
                      }
                    >
                      {paystackLoading
                        ? "Processing..."
                        : `Pay ₦${(
                            Number(product.price) * quantity
                          ).toLocaleString()}`}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* User Rating */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Rate this product</h3>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleRating(i + 1)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < userRating
                          ? "text-amber-400 fill-current"
                          : "text-gray-300 hover:text-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">
                  Product Description
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {product.description || "No description available."}
                </p>
                {product.how_to_use && (
                  <>
                    <h4 className="font-semibold mb-2">How to Use:</h4>
                    <p className="text-gray-600">{product.how_to_use}</p>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                <p className="text-gray-600">
                  {product.ingredients || "No ingredients listed."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="bg-white p-6 rounded-xl space-y-6">
                <h3 className="text-xl font-semibold">Shipping & Returns</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-6 h-6 text-rose-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Free Shipping</h4>
                      <p className="text-sm text-gray-600">
                        On orders over ₦50,000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-rose-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Secure Payment</h4>
                      <p className="text-sm text-gray-600">
                        100% secure transactions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <RotateCcw className="w-6 h-6 text-rose-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Easy Returns</h4>
                      <p className="text-sm text-gray-600">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-2">Delivery Information</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Standard delivery: 3-5 business days (₦1,500)</li>
                    <li>• Express delivery: 1-2 business days (₦3,000)</li>
                    <li>• Same day delivery available in Lagos (₦5,000)</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {/* Mock reviews */}
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-amber-400 fill-current"
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          Anonymous User
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Amazing product! Really improved my skin texture and
                        glow. Highly recommended for anyone looking for quality
                        skincare.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};
