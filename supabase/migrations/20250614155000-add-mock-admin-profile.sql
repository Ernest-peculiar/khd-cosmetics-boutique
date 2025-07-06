
-- First ensure the admin user exists in auth.users (this will be handled by the sign up process)
-- But we need to make sure the profile exists and has admin role

-- Insert or update the admin profile
INSERT INTO public.profiles (id, first_name, last_name, email, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Admin',
  'User', 
  'adminadmin123@gmail.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  email = 'adminadmin123@gmail.com',
  first_name = 'Admin',
  last_name = 'User';

-- Also handle the case where the auth.users entry might have a different UUID
-- Update any existing profile with the admin email to have admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'adminadmin123@gmail.com';
