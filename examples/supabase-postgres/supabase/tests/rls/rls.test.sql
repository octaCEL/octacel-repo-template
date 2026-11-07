BEGIN;
SELECT plan(1);
INSERT INTO public.organizations (id, name)
VALUES ('11111111-1111-4111-8111-111111111111', 'Tenant one');
INSERT INTO public.facilities (id, organization_id, name)
VALUES ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Visible facility');
SET LOCAL ROLE authenticated;
SELECT set_config('app.current_organization_id', '11111111-1111-4111-8111-111111111111', true);
SELECT is((SELECT count(*) FROM public.facilities), 1::bigint, 'tenant can read its facility');
RESET ROLE;
SELECT * FROM finish();
ROLLBACK;
