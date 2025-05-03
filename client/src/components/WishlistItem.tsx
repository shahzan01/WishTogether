import React from "react";
import Button from "./ui/Button";
import { WishlistItem as WishlistItemType } from "../api/wishlistService";
import { formatRelativeTime } from "../utils/formatters";

interface WishlistItemProps {
  item: WishlistItemType;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (item: WishlistItemType) => void;
  onDelete: (id: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  item,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        {/* Item image or placeholder */}
        {item.imageUrl ? (
          <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-md bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 text-xl">📦</span>
          </div>
        )}

        {/* Item details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.name}
            </h3>
            {item.price && (
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{item.price.toFixed(2)}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {item.description}
            </p>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block hover:underline"
            >
              View Item →
            </a>
          )}

          {/* Item metadata */}
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div>
                <span>Added by </span>
                <span className="font-medium">{item.createdBy.fullName}</span>
                <span> {formatRelativeTime(item.createdAt)}</span>
              </div>
              {item.updatedAt !== item.createdAt && (
                <div>
                  <span>Last edited by </span>
                  <span className="font-medium">{item.updatedBy.fullName}</span>
                  <span> {formatRelativeTime(item.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {
        <div className="mt-3 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700 pt-3">
          {canEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete
            </Button>
          )}
        </div>
      }
    </div>
  );
};

export default WishlistItem;
