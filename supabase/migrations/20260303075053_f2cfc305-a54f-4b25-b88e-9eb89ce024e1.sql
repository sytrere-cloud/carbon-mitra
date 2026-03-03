
-- Add 'auditor' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'auditor';

-- Create audit_reports table to track auto-generated reports
CREATE TABLE public.audit_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auditor_id UUID NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'seasonal',
  status TEXT NOT NULL DEFAULT 'pending',
  farm_ids UUID[] DEFAULT '{}',
  report_data JSONB DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auditors can view own reports"
ON public.audit_reports FOR SELECT
TO authenticated
USING (auth.uid() = auditor_id);

CREATE POLICY "Admins can manage all reports"
ON public.audit_reports FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create audit_assignments table to assign farms to auditors
CREATE TABLE public.audit_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auditor_id UUID NOT NULL,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  season TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM now()),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (auditor_id, farm_id, year)
);

ALTER TABLE public.audit_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auditors can view own assignments"
ON public.audit_assignments FOR SELECT
TO authenticated
USING (auth.uid() = auditor_id);

CREATE POLICY "Admins can manage all assignments"
ON public.audit_assignments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow auditors to view photos of their assigned farms
CREATE POLICY "Auditors can view assigned farm photos"
ON public.farm_photos FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.audit_assignments aa
    WHERE aa.farm_id = farm_photos.farm_id
    AND aa.auditor_id = auth.uid()
    AND aa.status = 'active'
  )
);

-- Allow auditors to view NDVI of assigned farms
CREATE POLICY "Auditors can view assigned farm NDVI"
ON public.ndvi_readings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.audit_assignments aa
    WHERE aa.farm_id = ndvi_readings.farm_id
    AND aa.auditor_id = auth.uid()
    AND aa.status = 'active'
  )
);

-- Allow auditors to view assigned farms
CREATE POLICY "Auditors can view assigned farms"
ON public.farms FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.audit_assignments aa
    WHERE aa.farm_id = farms.id
    AND aa.auditor_id = auth.uid()
    AND aa.status = 'active'
  )
);

-- Allow auditors to view profiles of assigned farm owners
CREATE POLICY "Auditors can view assigned farmer profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.audit_assignments aa
    JOIN public.farms f ON f.id = aa.farm_id
    WHERE f.user_id = profiles.user_id
    AND aa.auditor_id = auth.uid()
    AND aa.status = 'active'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_audit_reports_updated_at
BEFORE UPDATE ON public.audit_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
