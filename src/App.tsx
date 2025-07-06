import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import { ProductPage } from "./pages/ProductPage";
import Jewelry from "./pages/Jewelry";
import HairWigs from "./pages/HairWigs";
import Skincare from "./pages/Skincare";
import MakeupBeauty from "./pages/MakeupBeauty";
import Perfumes from "./pages/Perfumes";
import Supplements from "./pages/Supplements";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/jewelry" element={<Jewelry />} />
            <Route path="/hair-wigs" element={<HairWigs />} />
            <Route path="/skincare" element={<Skincare />} />
            <Route path="/makeup-beauty" element={<MakeupBeauty />} />
            <Route path="/perfumes" element={<Perfumes />} />
            <Route path="/supplements" element={<Supplements />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
