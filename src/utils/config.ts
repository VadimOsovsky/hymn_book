export const BASE_URL = "http://192.168.0.203:3001/wycliffe-api";

// export const BASE_URL = "http://192.168.1.16/wycliffe-api";

export function getHeaderWithToken(token: string | null) {
  return {
    headers: {"x-access-token": token},
  };
}
