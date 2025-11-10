import { handleError } from '../utils/handleError';

export async function apiGet<T>(url: string, init?: RequestInit) {
  const [res, err] = await handleError(fetch(url, { ...init }));
  if (err) throw err;

  if (!res!.ok) {
    const body = await res!.text().catch(() => '');
    throw new Error(`GET ${url} failed: ${res!.status} ${body}`);
  }
  return res!.json() as Promise<T>;
}