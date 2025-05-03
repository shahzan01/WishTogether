import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import { Wishlist, CreateWishlistData } from "../api/wishlistService";

interface WishlistFormProps {
  onSubmit: (data: CreateWishlistData) => void;
  wishlist?: Wishlist; // If provided, we're editing an existing wishlist
  isSubmitting: boolean;
}

const WishlistForm: React.FC<WishlistFormProps> = ({
  onSubmit,
  wishlist,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<CreateWishlistData>({
    name: "",
    description: "",
    isPublic: false,
  });

  // Initialize form with wishlist data when editing
  useEffect(() => {
    if (wishlist) {
      setFormData({
        name: wishlist.name,
        description: wishlist.description || "",
        isPublic: wishlist.isPublic,
      });
    }
  }, [wishlist]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          value={formData.description}
          onChange={handleChange}
          rows={4}
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
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="isPublic"
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          Make this wishlist public
        </label>
      </div>

      {formData.isPublic && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Public wishlists can be viewed by anyone with the link. You will get
            a shareable link after creating the wishlist.
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting
            ? "Saving..."
            : wishlist
            ? "Update Wishlist"
            : "Create Wishlist"}
        </Button>
      </div>
    </form>
  );
};

export default WishlistForm;
