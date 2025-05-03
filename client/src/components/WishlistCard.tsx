import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { Wishlist } from "../api/wishlistService";
import { formatDate } from "../utils/formatters";
import { useAuth } from "../hooks/useAuth";

interface WishlistCardProps {
  wishlist: Wishlist;
  onDelete?: (id: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist, onDelete }) => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  // Check if current user is the owner
  const isOwner = wishlist.userId === userId;

  // Check if current user is a collaborator with edit permissions
  const collaborator = wishlist.collaborators?.find((c) => c.userId === userId);
  const canEdit = isOwner || collaborator?.canEdit || false;

  const handleView = () => {
    navigate(`/wishlist/${wishlist.id}`);
  };

  const handleEdit = () => {
    navigate(`/wishlist/edit/${wishlist.id}`);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(wishlist.id);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-colors bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {wishlist.name}
        </h3>
        <div className="flex space-x-2">
          {wishlist.isPublic && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              Public
            </span>
          )}
          {!isOwner && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {collaborator?.canEdit
                ? "Collaborator (Editor)"
                : "Collaborator (Viewer)"}
            </span>
          )}
        </div>
      </div>

      {wishlist.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {wishlist.description}
        </p>
      )}

      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">
            {wishlist.items && wishlist.items.length}
          </span>
          <span className="ml-1">items</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Created by: </span>
          <span className="ml-1 font-medium">{wishlist.user.fullName}</span>
          {isOwner && (
            <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
              You
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Last updated: </span>
          <span className="ml-1">{formatDate(wishlist.updatedAt)}</span>
        </div>
        {wishlist.collaborators && wishlist.collaborators.length > 0 && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Collaborators: </span>
            <span className="ml-1 font-medium">
              {wishlist.collaborators.length}
            </span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button size="sm" onClick={handleView}>
          View
        </Button>

        {canEdit && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Edit
          </Button>
        )}

        {isOwner && onDelete && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default WishlistCard;
