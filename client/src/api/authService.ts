import axios from "./axios";

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  statusCode: number;
  data: {
    data: {
      user: {
        id: string;
        email: string;
        fullName: string;
      };
      token?: string;
    };
  };
  message: string;
  success: boolean;
}

const authService = {
  /**
   * Register a new user
   */
  async signUp(userData: SignUpData) {
    const response = await axios.post<AuthResponse>("/auth/signup", userData);
    const data = response.data;

    if (data.success && data.data?.data?.token) {
      localStorage.setItem("token", data.data.data.token);
    }

    return data;
  },

  /**
   * Login a user
   */
  async signIn(credentials: SignInData) {
    const response = await axios.post<AuthResponse>(
      "/auth/signin",
      credentials
    );
    const data = response.data;

    if (data.success && data.data?.data?.token) {
      localStorage.setItem("token", data.data.data.token);
    }

    return data;
  },

  /**
   * Logout current user
   */
  async logout() {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return { success: true };
  },

  /**
   * Check if user is authenticated
   */
  async checkAuth() {
    try {
      const response = await axios.get("/auth/me");
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
};

export default authService;
