
-- Create storage bucket for farm photos
INSERT INTO storage.buckets (id, name, public) VALUES ('farm-photos', 'farm-photos', true);

-- RLS policies for farm-photos bucket
CREATE POLICY "Users can upload own farm photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'farm-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own farm photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'farm-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own farm photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'farm-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all farm photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'farm-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Add kisan_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kisan_id text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- Add evidence milestone tracking to farm_photos
ALTER TABLE public.farm_photos ADD COLUMN IF NOT EXISTS milestone_stage text;
ALTER TABLE public.farm_photos ADD COLUMN IF NOT EXISTS compass_heading numeric;
ALTER TABLE public.farm_photos ADD COLUMN IF NOT EXISTS network_id text;
ALTER TABLE public.farm_photos ADD COLUMN IF NOT EXISTS device_info jsonb;

-- Generate Kisan ID on profile creation
CREATE OR REPLACE FUNCTION public.generate_kisan_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_num integer;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM profiles;
  NEW.kisan_id := 'NB-' || LPAD(seq_num::text, 4, '0');
  NEW.referral_code := 'NB-' || LPAD(seq_num::text, 4, '0') || '-' || SUBSTR(md5(random()::text), 1, 4);
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_kisan_id
BEFORE INSERT ON public.profiles
FOR EACH ROW
WHEN (NEW.kisan_id IS NULL)
EXECUTE FUNCTION public.generate_kisan_id();
