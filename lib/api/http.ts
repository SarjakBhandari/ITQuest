export interface ApiEnvelope {
  ok: boolean;
  message?: string;
}

export async function apiRequest<T extends ApiEnvelope>(
  url: string,
  init: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {})
      },
      ...init
    });
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.');
  }

  let data: T;
  try {
    data = (await response.json()) as T;
  } catch {
    throw new Error('Unexpected server response. Please try again.');
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}
