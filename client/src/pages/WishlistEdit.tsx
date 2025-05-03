import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import wishlistService, {
  Wishlist,
  UpdateWishlistData,
} from "../api/wishlistService";
import Navbar from "../components/Navbar";
import WishlistForm from "../components/WishlistForm";
import Button from "../components/ui/Button";

const WishlistEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist data on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await wishlistService.getWishlistById(id);
        setWishlist(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        setError("Failed to load wishlist. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (data: UpdateWishlistData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await wishlistService.updateWishlist(id, data);
      // Redirect to wishlist detail page after successful update
      navigate(`/wishlist/${id}`);
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      setError("Failed to update wishlist. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate(`/wishlist/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-purple-500/20 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-purple-500/20 flex flex-col items-center justify-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-purple-500/20">
      {/* Header space for navbar */}
      <div className="h-16"></div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Edit Wishlist
          </h2>

          {wishlist && (
            <WishlistForm
              wishlist={wishlist}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={handleCancel} className="mr-4">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistEdit;
