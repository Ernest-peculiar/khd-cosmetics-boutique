
import { Link } from "react-router-dom";
import { Gem, Scissors, Droplets, Palette, Sparkles, Pill } from "lucide-react";

export const CategoryGrid = () => {
  const categories = [
    {
      name: "Jewelry",
      icon: Gem,
      href: "/jewelry",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Elegant pieces that complement your style"
    },
    {
      name: "Hair & Wigs",
      icon: Scissors,
      href: "/hair-wigs",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Premium hair extensions and styling solutions"
    },
    {
      name: "Skincare",
      icon: Droplets,
      href: "/skincare",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Gentle, effective skincare for all skin types"
    },
    {
      name: "Makeup & Beauty",
      icon: Palette,
      href: "/makeup-beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Professional-grade makeup essentials"
    },
    {
      name: "Perfumes",
      icon: Sparkles,
      href: "/perfumes",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Captivating fragrances for every occasion"
    },
    {
      name: "Supplements",
      icon: Pill,
      href: "/supplements",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Premium wellness and nutrition support"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop by
            <span className="block bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collections designed to enhance every aspect of your beauty routine
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                to={category.href}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 p-6 border border-gray-100 hover:border-rose-200 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-rose-400 to-amber-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    {category.description}
                  </p>

                  <div className="flex items-center text-rose-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                    Shop Now
                    <span className="ml-2">→</span>
                  </div>
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
