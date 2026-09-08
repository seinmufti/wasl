/** App is served under /wasl on nordlyssolytion.com (and matching local dev). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/wasl";

export function withBasePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!basePath) return normalized;
  if (normalized === basePath || normalized.startsWith(`${basePath}/`)) {
    return normalized;
  }
  return `${basePath}${normalized}`;
}
