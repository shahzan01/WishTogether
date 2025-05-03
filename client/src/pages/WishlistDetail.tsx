import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import wishlistService, {
  Wishlist as BaseWishlist,
  WishlistItem,
  Collaborator,
  CreateItemData,
} from "../api/wishlistService";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/formatters";
import WishlistItemComponent from "../components/WishlistItem";
import ItemFormModal from "../components/ItemFormModal";
import CollaboratorList from "../components/CollaboratorList";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
// Extended Wishlist interface with frontend-specific properties
interface ExtendedWishlist extends BaseWishlist {
  isOwner: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// API error interface
interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const WishlistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [wishlist, setWishlist] = useState<ExtendedWishlist | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | undefined>(
    undefined
  );

  // Determine if current user is owner
  const [isOwner, setIsOwner] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchWishlistData = async () => {
      try {
        setIsLoading(true);
        const wishlistData = await wishlistService.getWishlistById(id);
        // Cast data and set frontend-specific properties
        const extendedWishlist = wishlistData as ExtendedWishlist;
        extendedWishlist.isOwner = wishlistData.userId === userId;
        extendedWishlist.canDelete = wishlistData.userId === userId;
        extendedWishlist.canEdit = wishlistData.collaborators.some(
          (collaborator) =>
            collaborator.userId === userId && collaborator.canEdit
        );

        // Check if user has access to this wishlist
        const hasAccess =
          extendedWishlist.isOwner ||
          extendedWishlist.isPublic ||
          wishlistData.collaborators.some(
            (collaborator) => collaborator.userId === userId
          );

        if (!hasAccess) {
          // User has no permission to view this wishlist
          navigate("/wishlist/not-found");
          return;
        }

        setWishlist(extendedWishlist);
        setItems(wishlistData.items || []);

        // Fetch collaborators
        const collaboratorsData = await wishlistService.getCollaborators(id);
        setCollaborators(collaboratorsData);

        // Check if user is owner or has edit permissions
        setIsOwner(extendedWishlist.isOwner);
        setCanDelete(extendedWishlist.canDelete);
        setCanEdit(extendedWishlist.isOwner || extendedWishlist.canEdit);

        setError(null);
      } catch (err: unknown) {
        console.error("Failed to fetch wishlist:", err);

        // If there's a 403 or 404 error, redirect to not found page
        const apiError = err as ApiError;
        if (
          apiError &&
          (apiError.response?.status === 403 ||
            apiError.response?.status === 404)
        ) {
          navigate("/wishlist/not-found");
          return;
        }

        setError("Failed to load wishlist. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistData();
  }, [id, userId, navigate]);

  // Handler for adding a new item
  const handleAddItem = async (itemData: CreateItemData) => {
    if (!id || !wishlist) return;

    try {
      const newItem = await wishlistService.addItemToWishlist(id, itemData);
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      console.error("Failed to add item:", err);
      throw err;
    }
  };

  // Handler for updating an item
  const handleUpdateItem = async (itemId: string, itemData: CreateItemData) => {
    if (!id || !wishlist) return;

    try {
      const updatedItem = await wishlistService.updateItem(
        id,
        itemId,
        itemData
      );
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      console.error("Failed to update item:", err);
      throw err;
    }
  };

  // Handler for deleting an item
  const handleDeleteItem = async (itemId: string) => {
    if (!id || !wishlist) return;

    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await wishlistService.deleteItem(id, itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  // Handler for adding a collaborator
  const handleAddCollaborator = async (userId: string, canEdit: boolean) => {
    if (!id || !wishlist) return;

    try {
      const newCollaborator = await wishlistService.addCollaborator(id, {
        userId,
        canEdit,
      });
      setCollaborators((prev) => [...prev, newCollaborator]);
      return newCollaborator;
    } catch (err) {
      console.error("Failed to add collaborator:", err);
      throw err;
    }
  };

  // Handler for removing a collaborator
  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!id || !wishlist) return;

    if (!window.confirm("Are you sure you want to remove this collaborator?")) {
      return;
    }

    try {
      await wishlistService.removeCollaborator(id, collaboratorId);
      setCollaborators((prev) =>
        prev.filter((collaborator) => collaborator.id !== collaboratorId)
      );
    } catch (err) {
      console.error("Failed to remove collaborator:", err);
    }
  };

  // Handler for updating collaborator permissions
  const handleUpdateCollaboratorPermission = async (
    userId: string,
    canEdit: boolean
  ) => {
    if (!id || !wishlist) return;

    try {
      await wishlistService.updateCollaboratorPermission(id, userId, canEdit);

      // Update the collaborator in state
      setCollaborators((prev) =>
        prev.map((collaborator) =>
          collaborator.userId === userId
            ? { ...collaborator, canEdit }
            : collaborator
        )
      );
    } catch (err) {
      console.error("Failed to update collaborator permission:", err);
      alert("Failed to update collaborator permission. Please try again.");
    }
  };

  // Handle showing the edit item modal
  const handleEditItem = (item: WishlistItem) => {
    setEditingItem(item);
    setShowAddItemModal(true);
  };

  // Handle closing the item form modal
  const handleCloseItemModal = () => {
    setShowAddItemModal(false);
    setEditingItem(undefined);
  };

  // Handle item form submission
  const handleItemFormSubmit = async (itemData: CreateItemData) => {
    console.log("Received item data in WishlistDetail:", itemData);
    try {
      if (editingItem) {
        console.log("Updating existing item:", editingItem.id);
        const updatedItem = await handleUpdateItem(editingItem.id, itemData);
        console.log("Item updated successfully:", updatedItem);
        setShowAddItemModal(false);
        return updatedItem;
      } else {
        console.log("Adding new item");
        const newItem = await handleAddItem(itemData);
        console.log("Item added successfully:", newItem);
        setShowAddItemModal(false);
        return newItem;
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      alert("Failed to save item. Please try again.");
    }
  };

  // Copy public ID to clipboard
  const copyPublicId = () => {
    if (!wishlist?.publicId) return;

    navigator.clipboard
      .writeText(wishlist.publicId)
      .then(() => alert("Public ID copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  // Generate and copy shareable link to clipboard
  const copyShareableLink = () => {
    if (!wishlist?.publicId) return;

    const shareableLink = `${window.location.origin}/wishlist/public/${wishlist.publicId}`;

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => alert("Shareable link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy link:", err));
  };

  // Share via email
  const shareViaEmail = () => {
    if (!wishlist?.publicId) return;

    const shareableLink = `${window.location.origin}/wishlist/public/${wishlist.publicId}`;
    const subject = encodeURIComponent(
      `Check out my wishlist: ${wishlist.name}`
    );
    const body = encodeURIComponent(
      `I wanted to share my wishlist with you: ${shareableLink}`
    );

    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // Handle collaborator functions to match the expected interface in CollaboratorList
  const handleAddCollaboratorWrapper = (data: {
    userId: string;
    canEdit: boolean;
  }) => {
    if (!id || !wishlist) return;
    handleAddCollaborator(data.userId, data.canEdit);
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
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
      {/* Navigation */}
      <div className="h-16"></div>
      <Navbar></Navbar>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Role Banner */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-gray-300">
                Your role:
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isOwner
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                    : canEdit
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {isOwner ? "Owner" : canEdit ? "Editor" : "Viewer"}
              </span>
            </div>
            <div>
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/wishlist/edit/${id}`)}
                >
                  Edit Wishlist Details
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Wishlist Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
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
                {wishlist.isPublic && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    Public
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                  Created {formatDate(wishlist.createdAt)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  Owner: {wishlist.user.fullName}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <Button onClick={() => setShowAddItemModal(true)}>
                  Add Item
                </Button>
              )}
              {wishlist.isPublic && wishlist.publicId && (
                <Button variant="outline" onClick={copyShareableLink}>
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Items
              </h3>

              {items.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This wishlist doesn't have any items yet.
                  </p>
                  {canEdit && (
                    <Button onClick={() => setShowAddItemModal(true)}>
                      Add First Item
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <WishlistItemComponent
                      key={item.id}
                      item={item}
                      canEdit={canEdit}
                      canDelete={canDelete}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Collaborators */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Collaborators
              </h3>
              <CollaboratorList
                collaborators={collaborators}
                isOwner={isOwner}
                onRemove={handleRemoveCollaborator}
                onUpdatePermission={handleUpdateCollaboratorPermission}
              />
            </div>

            {/* Sharing */}
            {wishlist.isPublic && wishlist.publicId && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Sharing
                </h3>
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Share this wishlist with others:
                  </p>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="text"
                      value={`${window.location.origin}/wishlist/public/${wishlist.publicId}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      aria-label="Shareable link for this wishlist"
                      title="Shareable link for this wishlist"
                    />
                    <Button
                      variant="outline"
                      onClick={copyShareableLink}
                      title="Copy link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Wishlist ID for manual addition:
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={wishlist.publicId}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      aria-label="Wishlist ID for manual addition"
                      title="Wishlist ID for manual addition"
                    />
                    <Button
                      variant="outline"
                      onClick={copyPublicId}
                      title="Copy ID"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Share directly:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={shareViaEmail}
                      title="Share via email"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="ml-1">Email</span>
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Others can view this wishlist using the shareable link or add
                  it to their account using the wishlist ID.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      <ItemFormModal
        isOpen={showAddItemModal}
        onClose={handleCloseItemModal}
        onSubmit={handleItemFormSubmit}
        item={editingItem}
        title={editingItem ? "Edit Item" : "Add Item"}
      />
    </div>
  );
};

export default WishlistDetail;
