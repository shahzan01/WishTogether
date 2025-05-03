import { createBrowserRouter, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/authAtom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import WishlistDetail from "../pages/WishlistDetail";
import WishlistEdit from "../pages/WishlistEdit";
import PublicWishlist from "../pages/PublicWishlist";
import WishlistNotFound from "../pages/WishlistNotFound";
import PublicWishlists from "../pages/PublicWishlists";

// Auth guard component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useRecoilValue(authAtom);

  if (!auth.isAuthenticated) {
    // Redirect to signin if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return children;
};

// Public routes guard (redirect to dashboard if already logged in)
const PublicOnly = ({ children }: { children: JSX.Element }) => {
  const auth = useRecoilValue(authAtom);

  if (auth.isAuthenticated) {
    // Redirect to dashboard if authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: (
      <PublicOnly>
        <SignIn />
      </PublicOnly>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicOnly>
        <SignUp />
      </PublicOnly>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/wishlist/:id",
    element: (
      <RequireAuth>
        <WishlistDetail />
      </RequireAuth>
    ),
  },
  {
    path: "/wishlist/edit/:id",
    element: (
      <RequireAuth>
        <WishlistEdit />
      </RequireAuth>
    ),
  },
  {
    path: "/wishlist/public/:publicId",
    element: <PublicWishlist />,
  },
  {
    path: "/wishlist/not-found",
    element: <WishlistNotFound />,
  },

  // Catch-all route
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/public-wishlists",
    element: (
      <RequireAuth>
        <PublicWishlists />
      </RequireAuth>
    ),
  },
]);

export default router;
