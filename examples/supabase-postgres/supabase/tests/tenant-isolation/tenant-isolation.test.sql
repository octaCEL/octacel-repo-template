BEGIN;
SELECT plan(2);
INSERT INTO public.organizations (id, name)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'Tenant one'),
    ('22222222-2222-4222-8222-222222222222', 'Tenant two');
INSERT INTO public.facilities (id, organization_id, name)
VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Tenant one facility'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'Tenant two facility');
SET LOCAL ROLE authenticated;
SELECT set_config('app.current_organization_id', '11111111-1111-4111-8111-111111111111', true);
SELECT is((SELECT count(*) FROM public.facilities), 1::bigint, 'tenant one cannot see tenant two rows');
SELECT set_config('app.current_organization_id', '22222222-2222-4222-8222-222222222222', true);
SELECT is((SELECT count(*) FROM public.facilities), 1::bigint, 'tenant two can see only its own row');
RESET ROLE;
SELECT * FROM finish();
ROLLBACK;
