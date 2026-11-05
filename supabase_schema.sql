-- ==============================================================================
-- EXPOSYS DATA LABS - AI ASSISTANT ASSESSMENT PROGRAM 2026
-- Supabase PostgreSQL Schema & Security Rules (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create student_registrations Table
CREATE TABLE IF NOT EXISTS public.student_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_response_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile_number TEXT NOT NULL,
    college_name TEXT NOT NULL,
    degree TEXT NOT NULL DEFAULT 'B.E / B.Tech',
    engineering_branch TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    registration_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_reference TEXT,
    payment_verified_at TIMESTAMPTZ,
    payment_verified_by TEXT,
    registration_status TEXT NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'confirmed', 'rejected', 'completed')),
    synchronization_status TEXT NOT NULL DEFAULT 'success' CHECK (synchronization_status IN ('success', 'failed', 'pending')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create synchronization_logs Table
CREATE TABLE IF NOT EXISTS public.synchronization_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_response_id TEXT,
    payload_summary TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    error_message TEXT,
    ip_address TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    retried_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create admin_users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'reviewer')),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.student_registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_mobile ON public.student_registrations(mobile_number);
CREATE INDEX IF NOT EXISTS idx_registrations_college ON public.student_registrations(college_name);
CREATE INDEX IF NOT EXISTS idx_registrations_branch ON public.student_registrations(engineering_branch);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON public.student_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.student_registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_registrations_timestamp ON public.student_registrations(registration_timestamp DESC);

-- 6. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_student_registrations_modtime ON public.student_registrations;
CREATE TRIGGER update_student_registrations_modtime
    BEFORE UPDATE ON public.student_registrations
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- 7. Row Level Security (RLS)
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synchronization_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security Policy: Students/Public cannot query student data directly
-- Only authenticated administrators or service_role can access student data
CREATE POLICY "Admins have full access to student registrations"
    ON public.student_registrations
    FOR ALL
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users) OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users) OR auth.role() = 'service_role');

CREATE POLICY "Admins have full access to synchronization logs"
    ON public.synchronization_logs
    FOR ALL
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users) OR auth.role() = 'service_role');
