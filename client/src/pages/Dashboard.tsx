import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

import WishlistCard from "../components/WishlistCard";
import wishlistService, {
  Wishlist,
  CreateWishlistData,
} from "../api/wishlistService";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

// Modal component for creating a new wishlist
const CreateWishlistModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWishlistData) => Promise<void>;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateWishlistData>({
    name: "",
    description: "",
    isPublic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create wishlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Wishlist
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Wishlist Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Birthday Wishlist"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="What's this wishlist for?"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={
                  handleChange as React.ChangeEventHandler<HTMLInputElement>
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isPublic"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Make this wishlist public
              </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Wishlist"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add wishlist by public ID modal
const AddByPublicIdModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (publicId: string) => Promise<void>;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [publicId, setPublicId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicId.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(publicId);
      onClose();
    } catch (error) {
      console.error("Failed to add wishlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Wishlist by ID
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="publicId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Public ID *
              </label>
              <input
                type="text"
                id="publicId"
                value={publicId}
                onChange={(e) => setPublicId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter the public ID of the wishlist"
              />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the public ID shared with you to add this wishlist to your
              dashboard.
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !publicId.trim()}>
                {isSubmitting ? "Adding..." : "Add Wishlist"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const navigate = useNavigate();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddByIdModal, setShowAddByIdModal] = useState(false);

  // Separate owned and collaborative wishlists
  const ownedWishlists = wishlists.filter(
    (wishlist) => wishlist.userId === userId
  );
  const collaborativeWishlists = wishlists.filter(
    (wishlist) => wishlist.userId !== userId
  );

  // Fetch wishlists on component mount
  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setIsLoading(true);
        const data = await wishlistService.getWishlists();
        setWishlists(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch wishlists:", err);
        setError("Failed to load wishlists. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  // Create new wishlist
  const handleCreateWishlist = async (data: CreateWishlistData) => {
    try {
      const newWishlist = await wishlistService.createWishlist(data);
      setWishlists((prev) => [...prev, newWishlist]);
    } catch (err) {
      console.error("Failed to create wishlist:", err);
      throw err;
    }
  };

  // Add wishlist by public ID
  const handleAddByPublicId = async (publicId: string) => {
    try {
      const wishlist = await wishlistService.addWishlistByPublicId(publicId);
      setWishlists((prev) => [...prev, wishlist]);
    } catch (err) {
      console.error("Failed to add wishlist by public ID:", err);
      throw err;
    }
  };

  // Delete wishlist
  const handleDeleteWishlist = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this wishlist?")) {
      return;
    }

    try {
      await wishlistService.deleteWishlist(id);
      setWishlists((prev) => prev.filter((wishlist) => wishlist.id !== id));
    } catch (err) {
      console.error("Failed to delete wishlist:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-purple-500/20">
      {/* Header with transparency */}
      <div className="h-16"></div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your wishlists, add items, and share with friends and family.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 hover:shadow-md hover:-translate-y-1 duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Create New Wishlist
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start a new wishlist for any occasion
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Create
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 hover:shadow-md hover:-translate-y-1 duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Add Shared Wishlist
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Add a wishlist shared with you by ID
            </p>
            <Button
              onClick={() => setShowAddByIdModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Add by ID
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 hover:shadow-md hover:-translate-y-1 duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Browse Public Lists
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Discover public wishlists from others
            </p>
            <Button
              onClick={() => navigate("/public-wishlists")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Browse Now
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 hover:shadow-md hover:-translate-y-1 duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Manage Profile
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Update your account settings
            </p>
            <Button
              disabled
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 opacity-50"
            >
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Your Wishlists */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Wishlists
          </h3>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Loading wishlists...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : ownedWishlists.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any wishlists yet.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Your First Wishlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedWishlists.map((wishlist) => (
                <WishlistCard
                  key={wishlist.id}
                  wishlist={wishlist}
                  onDelete={handleDeleteWishlist}
                />
              ))}
            </div>
          )}
        </div>

        {/* Collaborative Wishlists */}
        {collaborativeWishlists.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-8 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Collaborative Wishlists
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaborativeWishlists.map((wishlist) => (
                <WishlistCard
                  key={wishlist.id}
                  wishlist={wishlist}
                  onDelete={undefined} // Collaborators can't delete the wishlist
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-8 transition-colors backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recent Activity
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400 py-4">
            Activity tracking coming soon!
          </p>
        </div>
      </div>

      {/* Modals */}
      <CreateWishlistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWishlist}
      />

      <AddByPublicIdModal
        isOpen={showAddByIdModal}
        onClose={() => setShowAddByIdModal(false)}
        onSubmit={handleAddByPublicId}
      />
    </div>
  );
};

export default Dashboard;
