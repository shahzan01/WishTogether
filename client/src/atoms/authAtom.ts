import { atom } from "recoil";
import { jwtDecode } from "jwt-decode";

// Types
interface TokenPayload {
  exp: number;
  id: string;
  iat: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
}

// Initial auth state
const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      isAuthenticated: false,
      token: null,
      userId: null,
    };
  }

  try {
    // Decode the token
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token is expired, clean up
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        isAuthenticated: false,
        token: null,
        userId: null,
      };
    }

    // Token is valid
    return {
      isAuthenticated: true,
      token,
      userId: decoded.id,
    };
  } catch {
    // Invalid token, clean up
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {
      isAuthenticated: false,
      token: null,
      userId: null,
    };
  }
};

// Auth atom
export const authAtom = atom<AuthState>({
  key: "authState",
  default: getInitialAuthState(),
});
