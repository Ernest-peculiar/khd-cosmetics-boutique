
-- Add admin role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'user';

-- Add additional fields to products table
ALTER TABLE public.products 
ADD COLUMN ingredients TEXT,
ADD COLUMN how_to_use TEXT;

-- Create admin user with specified email
-- Note: You'll need to sign up with adminadmin123@gmail.com first, then this will set the role
UPDATE public.profiles SET role = 'admin' WHERE email = 'adminadmin123@gmail.com';

-- Create RLS policy for admin access to products
CREATE POLICY "Admins can insert products" 
  ON public.products 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update products" 
  ON public.products 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete products" 
  ON public.products 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;
