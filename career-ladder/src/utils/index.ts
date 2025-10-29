export function createPageUrl(name: string) {
  const map: Record<string, string> = {
    Dashboard: "/dashboard",
    Applications: "/applications",
    Analytics: "/analytics",
    Settings: "/settings",
    AddApplication: "/applications/new",
  };
  return map[name] ?? "/";
}
