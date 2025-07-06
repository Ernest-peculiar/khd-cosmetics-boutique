import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, loading, updateQuantity, removeFromCart, getTotalPrice } =
    useCart();
  const navigate = useNavigate();

  // Track if this is the first load
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (!loading && initialLoad) {
      setInitialLoad(false);
    }
  }, [loading, initialLoad]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50000 ? 0 : 2500; // Free shipping over ₦50,000
  const total = subtotal + shipping;

  const [showPaystack, setShowPaystack] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [paying, setPaying] = useState(false);

  const paystackHandler = () => {
    if (!buyerEmail || !buyerPhone) {
      alert("Please enter your email and phone.");
      return;
    }
    setPaying(true);
    const handler =
      (window as any).PaystackPop &&
      (window as any).PaystackPop.setup({
        key: "pk_live_c987a68a6041457c9405d79429d1ad7f39ecaa3f",
        email: buyerEmail,
        amount: Number(total) * 100, // kobo
        currency: "NGN",
        ref: `KHD-CART-${Date.now()}`,
        metadata: { phone: buyerPhone, cart: cartItems },
        callback: function (response: any) {
          setPaying(false);
          setShowPaystack(false);
          alert(`Payment Successful! Payment ref: ${response.reference}`);
        },
        onClose: function () {
          setPaying(false);
        },
      });
    if (handler) handler.openIframe();
  };

  React.useEffect(() => {
    if (!(window as any).PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!user) {
    return null; // Will redirect to auth
  }

  // Only show full-page loading on initial load
  if (initialLoad && loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading your cart...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Add some products to get started
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-6 ${
                      index !== cartItems.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.products.image}
                        alt={item.products.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.products.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ₦{Number(item.products.price).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₦
                          {(
                            Number(item.products.price) * item.quantity
                          ).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0
                        ? "Free"
                        : `₦${shipping.toLocaleString()}`}
                    </span>
                  </div>

                  {subtotal < 50000 && (
                    <p className="text-sm text-gray-500">
                      Add ₦{(50000 - subtotal).toLocaleString()} more for free
                      shipping
                    </p>
                  )}

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white"
                  onClick={() => setShowPaystack(true)}
                >
                  Proceed to Checkout
                </Button>
                <Dialog open={showPaystack} onOpenChange={setShowPaystack}>
                  <DialogContent>
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">Checkout</h2>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                      />
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          setShowPaystack(false); // Close modal first
                          setTimeout(() => {
                            paystackHandler(); // Then open Paystack payment
                          }, 300); // Small delay for smooth UX
                        }}
                        disabled={paying}
                        className="w-full bg-emerald-600 text-white"
                      >
                        {paying
                          ? "Processing..."
                          : `Pay ₦${total.toLocaleString()}`}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
