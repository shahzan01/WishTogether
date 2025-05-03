import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const WishlistNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mx-auto text-purple-600 dark:text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Wishlist Not Found
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          This wishlist doesn't exist, is private, or you don't have permission
          to view it.
        </p>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Button onClick={() => navigate("/")} variant="outline">
            Go Home
          </Button>

          <Button onClick={() => navigate("/dashboard")}>My Dashboard</Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistNotFound;
