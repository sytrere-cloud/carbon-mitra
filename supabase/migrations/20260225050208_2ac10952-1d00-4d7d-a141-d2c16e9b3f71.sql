
-- Fix all RLS policies: change from RESTRICTIVE to PERMISSIVE
-- Drop all existing restrictive policies and recreate as permissive

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- farms
DROP POLICY IF EXISTS "Admins can view all farms" ON public.farms;
DROP POLICY IF EXISTS "Users can manage own farms" ON public.farms;

CREATE POLICY "Users can manage own farms" ON public.farms FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all farms" ON public.farms FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- farm_photos
DROP POLICY IF EXISTS "Admins can update photo verification" ON public.farm_photos;
DROP POLICY IF EXISTS "Admins can view all photos" ON public.farm_photos;
DROP POLICY IF EXISTS "Users can manage own photos" ON public.farm_photos;

CREATE POLICY "Users can manage own photos" ON public.farm_photos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all photos" ON public.farm_photos FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update photo verification" ON public.farm_photos FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- carbon_credits
DROP POLICY IF EXISTS "Admins can manage all credits" ON public.carbon_credits;
DROP POLICY IF EXISTS "Users can view own credits" ON public.carbon_credits;

CREATE POLICY "Users can view own credits" ON public.carbon_credits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all credits" ON public.carbon_credits FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- ndvi_readings
DROP POLICY IF EXISTS "Admins can manage NDVI data" ON public.ndvi_readings;
DROP POLICY IF EXISTS "Users can view own farm NDVI" ON public.ndvi_readings;

CREATE POLICY "Users can view own farm NDVI" ON public.ndvi_readings FOR SELECT USING (EXISTS (SELECT 1 FROM farms WHERE farms.id = ndvi_readings.farm_id AND farms.user_id = auth.uid()));
CREATE POLICY "Admins can manage NDVI data" ON public.ndvi_readings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
