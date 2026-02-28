export const roleRedirectMap: Record<string, string> = {
  VETERINARIO: "/portal/veterinario",
  EMPRESA: "/portal/empresa",
  CLIENTE: "/portal/cliente",
  ADMIN: "/portal/admin"
};

export const getRedirectByRole = (role: string) =>
  roleRedirectMap[role] ?? "/dashboard";
