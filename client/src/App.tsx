import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { authAtom } from "./atoms/authAtom";
import { jwtDecode } from "jwt-decode";
import ThemeInitializer from "./components/ThemeInitializer";
import router from "./routes/routes";
import "./App.css";

// Define the TokenPayload interface
interface TokenPayload {
  exp: number;
  id: string;
  iat: number;
}

// Function to check auth status on app load
const AuthStatusChecker: React.FC = () => {
  const setAuth = useSetRecoilState(authAtom);

  useEffect(() => {
    // Simply check if token exists and is valid
    const token = localStorage.getItem("token");

    if (!token) {
      setAuth({
        isAuthenticated: false,
        token: null,
        userId: null,
      });
      return;
    }

    // Basic token validation
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem("token");
        setAuth({
          isAuthenticated: false,
          token: null,
          userId: null,
        });
      } else {
        // Token valid
        setAuth({
          isAuthenticated: true,
          token,
          userId: decoded.id,
        });
      }
    } catch {
      // Invalid token
      localStorage.removeItem("token");
      setAuth({
        isAuthenticated: false,
        token: null,
        userId: null,
      });
    }
  }, [setAuth]);

  return null;
};

function App() {
  return (
    <RecoilRoot>
      <div className="app-container">
        <ThemeInitializer />
        <AuthStatusChecker />
        <RouterProvider router={router} />
      </div>
    </RecoilRoot>
  );
}

export default App;
