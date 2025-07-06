
-- Create a security definer function to check if user is admin
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    WHEN auth.uid()::text = '00000000-0000-0000-0000-000000000001' THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  END;
$$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;

-- Create new policies using the security definer function
CREATE POLICY "Admins can insert products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update products" 
  ON public.products 
  FOR UPDATE 
  USING (public.is_admin_user());

CREATE POLICY "Admins can delete products" 
  ON public.products 
  FOR DELETE 
  USING (public.is_admin_user());

CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);
