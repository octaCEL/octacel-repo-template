export function tenantFacilityQuery(organizationId: string): {
  sql: string;
  values: string[];
} {
  return {
    sql: "SELECT id, name FROM public.facilities WHERE organization_id = $1::uuid",
    values: [organizationId],
  };
}
