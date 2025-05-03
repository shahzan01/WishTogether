import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import wishlistService, { Wishlist } from "../api/wishlistService";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/formatters";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

const PublicWishlists: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPublicWishlists = async () => {
      try {
        setIsLoading(true);
        const data = await wishlistService.getPublicWishlists();
        setWishlists(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch public wishlists:", err);
        setError("Failed to load public wishlists. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicWishlists();
  }, []);

  // Filter wishlists based on search term
  const filteredWishlists = wishlists.filter(
    (wishlist) =>
      wishlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToAccount = async (publicId: string) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    try {
      await wishlistService.addWishlistByPublicId(publicId);
      alert("Wishlist added to your account successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add wishlist to account:", err);
      alert("Failed to add wishlist to your account. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Public Wishlists
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover public wishlists created by other users. Find inspiration
            for your own wishlists or add them to your account.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Search by name, description, or creator..."
                aria-label="Search public wishlists"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlists Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading public wishlists...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg
                className="h-16 w-16 text-red-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : filteredWishlists.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              {searchTerm ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    No wishlists found matching "{searchTerm}"
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No public wishlists available yet.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWishlists.map((wishlist) => (
                <div
                  key={wishlist.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-colors bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {wishlist.name}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      Public
                    </span>
                  </div>

                  {wishlist.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {wishlist.description}
                    </p>
                  )}

                  <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">
                        {wishlist.items?.length || 0}
                      </span>
                      <span className="ml-1">items</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>Created by: </span>
                      <span className="ml-1 font-medium">
                        {wishlist.user.fullName}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>Created: </span>
                      <span className="ml-1">
                        {formatDate(wishlist.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/wishlist/public/${wishlist.publicId}`)
                      }
                    >
                      View
                    </Button>
                    {isAuthenticated && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToAccount(wishlist.publicId)}
                      >
                        Add to My Account
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicWishlists;
