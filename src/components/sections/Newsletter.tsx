
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Gift } from "lucide-react";

export const Newsletter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-rose-600 to-amber-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full">
              <Gift className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Get 20% Off Your First Order
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals, 
            exclusive offers, and beauty tips from our experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10 bg-white border-0 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <Button 
              size="lg" 
              className="bg-white text-rose-600 hover:bg-gray-50 font-medium px-8"
            >
              Subscribe
            </Button>
          </div>

          <p className="text-white/80 text-sm mt-4">
            No spam, unsubscribe at any time. Your privacy is protected.
          </p>
        </div>
      </div>
    </section>
  );
};
