
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_on_sale BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user likes table
CREATE TABLE public.user_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create user cart table
CREATE TABLE public.user_cart (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cart ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for products (public read access)
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create RLS policies for user_likes
CREATE POLICY "Users can view their own likes" 
  ON public.user_likes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes" 
  ON public.user_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON public.user_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_cart
CREATE POLICY "Users can view their own cart" 
  ON public.user_cart 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert items to their cart" 
  ON public.user_cart 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cart items" 
  ON public.user_cart 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their cart items" 
  ON public.user_cart 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, image, category, brand, rating, reviews_count, is_on_sale) VALUES
('Radiant Glow Serum', 'Transform your skin with this powerful vitamin C serum that brightens and evens skin tone.', 25000, 30000, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', 'skincare', 'GlowLux', 4.8, 124, true),
('Hydrating Face Moisturizer', 'Deep hydration for all skin types with hyaluronic acid and ceramides.', 18000, NULL, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', 'skincare', 'AquaDerm', 4.6, 89, false),
('Velvet Matte Lipstick', 'Long-lasting matte lipstick in stunning shades that won''t dry your lips.', 12000, 15000, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 'makeup-beauty', 'LipLux', 4.7, 156, true),
('Gold Hoop Earrings', 'Elegant 18k gold plated hoops perfect for any occasion.', 35000, NULL, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 'jewelry', 'GoldCraft', 4.9, 67, false),
('Luxury Perfume', 'Enchanting fragrance with notes of jasmine and vanilla.', 45000, 52000, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 'perfumes', 'Essence', 4.5, 203, true),
('Vitamin C Gummies', 'Boost your immunity with these delicious vitamin C supplements.', 8500, NULL, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'supplements', 'VitaBoost', 4.4, 91, false);
