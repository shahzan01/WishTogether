import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { authAtom } from "../atoms/authAtom";
import { jwtDecode } from "jwt-decode";
import authService from "../api/authService";

interface TokenPayload {
  exp: number;
  id: string;
  iat: number;
}

interface LoginParams {
  email: string;
  password: string;
}

interface SignupParams {
  fullName: string;
  email: string;
  password: string;
}

export function useAuth() {
  const [auth, setAuth] = useRecoilState(authAtom);
  const navigate = useNavigate();

  // Login handler
  const login = async (credentials: LoginParams) => {
    try {
      const response = await authService.signIn(credentials);

      if (response.success) {
        // Extract user id from the response
        const userId = response.data.data.user.id;

        // The token should be set in localStorage by authService.signIn
        // Get it directly after the sign in
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found in localStorage");
          return false;
        }

        // Update Recoil state
        setAuth({
          isAuthenticated: true,
          token,
          userId,
        });

        // Navigate to dashboard after successful login
        navigate("/dashboard");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to login:", error);
      return false;
    }
  };

  // Signup handler
  const signup = async (userData: SignupParams) => {
    try {
      const response = await authService.signUp(userData);

      if (response.success) {
        // Since registration usually doesn't return a token,
        // we'll log in the user after successful registration
        return await login({
          email: userData.email,
          password: userData.password,
        });
      }

      return false;
    } catch (error) {
      console.error("Failed to register:", error);
      return false;
    }
  };

  // Logout handler
  const logout = async () => {
    await authService.logout();
    // Update Recoil state
    setAuth({
      isAuthenticated: false,
      token: null,
      userId: null,
    });
    // Redirect to home
    navigate("/");
  };

  // Check if token is expired
  const isTokenExpired = () => {
    if (!auth.token) return true;

    try {
      const decoded = jwtDecode<TokenPayload>(auth.token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    userId: auth.userId,
    token: auth.token,
    login,
    signup,
    logout,
    isTokenExpired: isTokenExpired(),
  };
}
