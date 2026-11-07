BEGIN;
SELECT plan(3);
SELECT has_table('public', 'organizations', 'organizations table exists');
SELECT has_table('public', 'facilities', 'facilities table exists');
SELECT has_column('public', 'facilities', 'organization_id', 'facilities are assigned to an organization');
SELECT * FROM finish();
ROLLBACK;
