export function homeFor(role) {
  if (role === "PROVIDER") return "/provider/dashboard";
  if (role === "ADMIN") return "/admin/dashboard";
  return "/services";
}
