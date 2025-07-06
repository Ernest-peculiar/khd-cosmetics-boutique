
-- Revert to using the proper is_admin_user function for products table policies
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Create policies using the standard is_admin_user function
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

-- Update the is_admin_user function to properly handle the admin UUID
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    -- Check for the specific mock admin UUID or admin role in profiles
    WHEN auth.uid()::text = '00000000-0000-0000-0000-000000000001' THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  END;
$$;
