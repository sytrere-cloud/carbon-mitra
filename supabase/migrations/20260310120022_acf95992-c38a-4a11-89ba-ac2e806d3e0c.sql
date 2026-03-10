
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO public USING (auth.uid() = user_id);

-- farms
DROP POLICY IF EXISTS "Admins can view all farms" ON public.farms;
DROP POLICY IF EXISTS "Auditors can view assigned farms" ON public.farms;
DROP POLICY IF EXISTS "Users can manage own farms" ON public.farms;
CREATE POLICY "Users can manage own farms" ON public.farms FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all farms" ON public.farms FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Auditors can view assigned farms" ON public.farms FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM audit_assignments aa WHERE aa.farm_id = farms.id AND aa.auditor_id = auth.uid() AND aa.status = 'active'));

-- carbon_credits
DROP POLICY IF EXISTS "Admins can manage all credits" ON public.carbon_credits;
DROP POLICY IF EXISTS "Users can view own credits" ON public.carbon_credits;
CREATE POLICY "Admins can manage all credits" ON public.carbon_credits FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own credits" ON public.carbon_credits FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ndvi_readings
DROP POLICY IF EXISTS "Admins can manage NDVI data" ON public.ndvi_readings;
DROP POLICY IF EXISTS "Auditors can view assigned farm NDVI" ON public.ndvi_readings;
DROP POLICY IF EXISTS "Users can view own farm NDVI" ON public.ndvi_readings;
CREATE POLICY "Admins can manage NDVI data" ON public.ndvi_readings FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Auditors can view assigned farm NDVI" ON public.ndvi_readings FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM audit_assignments aa WHERE aa.farm_id = ndvi_readings.farm_id AND aa.auditor_id = auth.uid() AND aa.status = 'active'));
CREATE POLICY "Users can view own farm NDVI" ON public.ndvi_readings FOR SELECT TO public USING (EXISTS (SELECT 1 FROM farms WHERE farms.id = ndvi_readings.farm_id AND farms.user_id = auth.uid()));

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Auditors can view assigned farmer profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Auditors can view assigned farmer profiles" ON public.profiles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM audit_assignments aa JOIN farms f ON f.id = aa.farm_id WHERE f.user_id = profiles.user_id AND aa.auditor_id = auth.uid() AND aa.status = 'active'));

-- consent_agreements
DROP POLICY IF EXISTS "Admins can view all agreements" ON public.consent_agreements;
DROP POLICY IF EXISTS "Users can create own agreements" ON public.consent_agreements;
DROP POLICY IF EXISTS "Users can view own agreements" ON public.consent_agreements;
CREATE POLICY "Users can view own agreements" ON public.consent_agreements FOR SELECT TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can create own agreements" ON public.consent_agreements FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all agreements" ON public.consent_agreements FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- audit_assignments
DROP POLICY IF EXISTS "Admins can manage all assignments" ON public.audit_assignments;
DROP POLICY IF EXISTS "Auditors can view own assignments" ON public.audit_assignments;
CREATE POLICY "Admins can manage all assignments" ON public.audit_assignments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Auditors can view own assignments" ON public.audit_assignments FOR SELECT TO authenticated USING (auth.uid() = auditor_id);

-- audit_reports
DROP POLICY IF EXISTS "Admins can manage all reports" ON public.audit_reports;
DROP POLICY IF EXISTS "Auditors can view own reports" ON public.audit_reports;
CREATE POLICY "Admins can manage all reports" ON public.audit_reports FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Auditors can view own reports" ON public.audit_reports FOR SELECT TO authenticated USING (auth.uid() = auditor_id);

-- farm_photos
DROP POLICY IF EXISTS "Admins can update photo verification" ON public.farm_photos;
DROP POLICY IF EXISTS "Admins can view all photos" ON public.farm_photos;
DROP POLICY IF EXISTS "Auditors can view assigned farm photos" ON public.farm_photos;
DROP POLICY IF EXISTS "Users can manage own photos" ON public.farm_photos;
CREATE POLICY "Users can manage own photos" ON public.farm_photos FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all photos" ON public.farm_photos FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update photo verification" ON public.farm_photos FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Auditors can view assigned farm photos" ON public.farm_photos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM audit_assignments aa WHERE aa.farm_id = farm_photos.farm_id AND aa.auditor_id = auth.uid() AND aa.status = 'active'));
