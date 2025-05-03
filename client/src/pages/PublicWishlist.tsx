import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import wishlistService, {
  Wishlist,
  WishlistItem,
} from "../api/wishlistService";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/formatters";
import WishlistItemComponent from "../components/WishlistItem";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";

const PublicWishlist: React.FC = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicId) return;

    const fetchWishlistData = async () => {
      try {
        setIsLoading(true);
        const wishlistData = await wishlistService.getWishlistByPublicId(
          publicId
        );
        setWishlist(wishlistData);
        setItems(wishlistData.items || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch public wishlist:", err);
        setError(
          "Failed to load wishlist. It may not exist or might not be public."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistData();
  }, [publicId]);

  const addWishlistToAccount = async () => {
    if (!publicId) return;

    try {
      setIsLoading(true);
      await wishlistService.addWishlistByPublicId(publicId);
      alert("Wishlist added to your account successfully!");
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message);
      } else {
        setError("Failed to add wishlist to account. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading wishlist...</p>
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error || "Wishlist not found"}
        </p>
        <Button onClick={() => navigate("/")}>Back to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                WishTogether
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Homepage
              </Button>
              {isAuthenticated && (
                <Button onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Public Notice Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-blue-700 dark:text-blue-300">
              You're viewing a public wishlist shared by{" "}
              {wishlist.user.fullName}
            </p>
          </div>
          {isAuthenticated && (
            <Button onClick={addWishlistToAccount} disabled={isLoading}>
              Add to My Account
            </Button>
          )}
          {!isAuthenticated && (
            <div className="flex space-x-2">
              <Button onClick={() => navigate("/signin")} variant="outline">
                Sign In
              </Button>
              <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
          )}
        </div>

        {/* Wishlist Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 transition-colors">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {wishlist.name}
            </h2>
            {wishlist.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {wishlist.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                Created {formatDate(wishlist.createdAt)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                Created by {wishlist.user.fullName}
              </span>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Items
          </h3>

          {items.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                This wishlist doesn't have any items yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <WishlistItemComponent
                  key={item.id}
                  item={item}
                  canEdit={false}
                  canDelete={false}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicWishlist;
