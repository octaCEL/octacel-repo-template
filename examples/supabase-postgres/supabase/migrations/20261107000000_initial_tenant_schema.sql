CREATE TABLE IF NOT EXISTS public.organizations (
    id uuid PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.facilities (
    id uuid PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations (id),
    name text NOT NULL
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN;
    END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations, public.facilities TO authenticated;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organizations_by_tenant ON public.organizations;
CREATE POLICY organizations_by_tenant ON public.organizations
    USING (id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid)
    WITH CHECK (id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid);

DROP POLICY IF EXISTS facilities_by_tenant ON public.facilities;
CREATE POLICY facilities_by_tenant ON public.facilities
    USING (organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid)
    WITH CHECK (organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid);
