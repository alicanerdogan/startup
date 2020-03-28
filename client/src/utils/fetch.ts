export interface FetchInit extends Omit<RequestInit, "body"> {
  rawBody?: BodyInit;
  body?: { [key: string]: any };
  isAuthorized?: boolean;
}

export function fetchPublic(url: string, init: FetchInit = {}) {
  const headers = {
    ...(!init.rawBody && { "Content-Type": "application/json" }),
    ...(init.headers || {})
  };
  const body = (init.body && JSON.stringify(init.body)) || init.rawBody;
  return fetch(url, { method: "GET", ...init, body, headers });
}

export function fetchAuthorized(url: string, init: FetchInit = {}) {
  const jwt = localStorage.getItem("jwt");
  const headers = {
    ...(!init.rawBody && { "Content-Type": "application/json" }),
    ...(init.headers || {}),
    Authorization: jwt || ""
  };
  const body = (init.body && JSON.stringify(init.body)) || init.rawBody;
  return fetch(url, { method: "GET", ...init, headers, body });
}

class AuthorizationError extends Error {}

export function isAuthorizationError(error: any) {
  return error instanceof AuthorizationError;
}

export function checkStatus(response: Response) {
  if (response.status < 400 && response.status >= 200) {
    return response;
  }

  if (response.status === 401) {
    throw new AuthorizationError();
  }

  throw new Error(`Failed request. Response status: ${response.status}`);
}

export function parseJSON(response: Response) {
  return response.json();
}

export async function fetchAndParse<T = unknown>(
  url: string,
  init: FetchInit = {}
) {
  const fetchFn = init.isAuthorized ? fetchAuthorized : fetchPublic;
  const response = await fetchFn(url, init);
  checkStatus(response);
  return (parseJSON(response) as unknown) as T;
}
