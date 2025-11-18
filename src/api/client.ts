export async function apiGet<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GET ${url} failed: ${res.status} ${body}`);
  }

  return res.json() as Promise<T>;
}