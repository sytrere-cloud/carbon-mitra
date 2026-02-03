-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'farmer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create farms table with polygon boundaries
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  boundary JSONB, -- GeoJSON polygon coordinates
  area_hectares DECIMAL(10,2),
  crop_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create farm_photos table for MRV verification
CREATE TABLE public.farm_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL, -- 'sowing', 'growth', 'harvest', 'no_burn'
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  captured_at TIMESTAMPTZ NOT NULL,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create carbon_credits table
CREATE TABLE public.carbon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credits_amount DECIMAL(10,2) NOT NULL,
  price_per_credit DECIMAL(10,2),
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'sold', 'rejected'
  verification_date TIMESTAMPTZ,
  sale_date TIMESTAMPTZ,
  buyer_name TEXT,
  payout_amount DECIMAL(12,2),
  payout_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed'
  season TEXT,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create NDVI readings table for satellite data
CREATE TABLE public.ndvi_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  reading_date DATE NOT NULL,
  ndvi_value DECIMAL(4,3), -- -1 to 1
  health_score INTEGER, -- 0-100
  grid_data JSONB, -- 8x8 grid of NDVI values
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ndvi_readings ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies (only admins can manage roles)
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Farms policies
CREATE POLICY "Users can manage own farms" ON public.farms
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all farms" ON public.farms
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Farm photos policies
CREATE POLICY "Users can manage own photos" ON public.farm_photos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all photos" ON public.farm_photos
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update photo verification" ON public.farm_photos
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Carbon credits policies
CREATE POLICY "Users can view own credits" ON public.carbon_credits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all credits" ON public.carbon_credits
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- NDVI readings policies
CREATE POLICY "Users can view own farm NDVI" ON public.ndvi_readings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.farms WHERE farms.id = ndvi_readings.farm_id AND farms.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage NDVI data" ON public.ndvi_readings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.phone);
  
  -- Default role is farmer
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'farmer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_carbon_credits_updated_at
  BEFORE UPDATE ON public.carbon_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();