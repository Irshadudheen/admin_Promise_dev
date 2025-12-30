import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "accessToken";

export const TokenUtils = {
  setToken: (token: string, days: number = 7): void => {
    Cookies.set(TOKEN_KEY, token, {
      expires: days,
      secure: true,
      sameSite: "Strict",
    });
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: (): void => {
    Cookies.remove(TOKEN_KEY);
  },
};

export const decodeToken = <T = any>(): T | null => {
  const token = TokenUtils.getToken();
  let user: T | null = null;
  if (token) {
    try {
      user = jwtDecode<T>(token);
      console.log('decoded user', user);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  return user;
};