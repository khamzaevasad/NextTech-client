// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getJwtToken(): any {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") ?? "";
  }
}

export function setJwtToken(token: string) {
  localStorage.setItem("accessToken", token);
}
