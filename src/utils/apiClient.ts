export function isRealSessionToken(token?: string | null): token is string {
  if (!token) return false;
  const trimmed = token.trim();
  return (
    trimmed.length > 0 &&
    trimmed !== 'cookie-session' &&
    trimmed !== 'null' &&
    trimmed !== 'undefined'
  );
}

export function buildApiHeaders(
  token?: string | null,
  extra?: boolean | Record<string, string>
): Record<string, string> {
  const extraHeaders =
    extra === true ? { 'Content-Type': 'application/json' } : extra && typeof extra === 'object' ? extra : {};
  const headers: Record<string, string> = {
    'X-Requested-With': 'XMLHttpRequest',
    ...extraHeaders,
  };
  if (isRealSessionToken(token)) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers || {});
  if (!headers.has('X-Requested-With')) {
    headers.set('X-Requested-With', 'XMLHttpRequest');
  }
  const auth = headers.get('Authorization');
  if (auth && /^Bearer\s+(cookie-session|null|undefined)$/i.test(auth.trim())) {
    headers.delete('Authorization');
  }
  return fetch(input, {
    ...init,
    credentials: init.credentials ?? 'include',
    headers,
  });
}
