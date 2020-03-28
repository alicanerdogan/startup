import { fetchAndParse } from "./fetch";

export type UserPrimitive = {
  email: string;
  password: string;
};

export type UserPayload = {
  email: string;
};

export async function createUser(user: UserPrimitive) {
  return fetchAndParse<UserPayload>("/api/users", {
    method: "POST",
    body: user,
    isAuthorized: false
  });
}

export async function getUser() {
  return fetchAndParse<UserPayload>("/api/users", {
    method: "GET",
    isAuthorized: true
  });
}

export type UserCredentials = {
  email: string;
  password: string;
};

export type Session = {
  token: string;
};

export async function createSession(credentials: UserCredentials) {
  return fetchAndParse<Session>("/api/sessions", {
    method: "POST",
    body: credentials,
    isAuthorized: false
  });
}

export type Resource = {
  token: string;
};

export async function getResource() {
  return fetchAndParse<Resource>("/api/resource", {
    method: "GET",
    isAuthorized: true
  });
}

export async function getPublicResource() {
  return fetchAndParse<Resource>("/api/public/resource", {
    method: "GET",
    isAuthorized: true
  });
}
