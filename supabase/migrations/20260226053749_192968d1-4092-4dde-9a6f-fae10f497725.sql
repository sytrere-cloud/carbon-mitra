
-- Table to store farmer consent agreements and signatures
CREATE TABLE public.consent_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agreement_type TEXT NOT NULL DEFAULT 'carbon_rights_transfer',
  agreement_version TEXT NOT NULL DEFAULT '1.0',
  full_name TEXT NOT NULL,
  aadhaar_last_four TEXT,
  signature_type TEXT NOT NULL CHECK (signature_type IN ('draw', 'type')),
  signature_data TEXT NOT NULL,
  consent_method TEXT NOT NULL DEFAULT 'self_declaration',
  otp_verified BOOLEAN DEFAULT false,
  voice_consent_url TEXT,
  agreement_hash TEXT,
  ip_address TEXT,
  device_info JSONB,
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consent_agreements ENABLE ROW LEVEL SECURITY;

-- Users can insert their own agreements
CREATE POLICY "Users can create own agreements"
ON public.consent_agreements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own agreements
CREATE POLICY "Users can view own agreements"
ON public.consent_agreements
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all agreements
CREATE POLICY "Admins can view all agreements"
ON public.consent_agreements
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add aadhaar_last_four and kyc_status to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS aadhaar_last_four TEXT,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS kyc_completed_at TIMESTAMP WITH TIME ZONE;
