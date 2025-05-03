import React, { useState } from "react";

import { Collaborator, AddCollaboratorData } from "../api/wishlistService";
import { formatDate } from "../utils/formatters";

interface CollaboratorListProps {
  collaborators: Collaborator[];
  isOwner: boolean;

  onRemove: (userId: string) => void;
  onUpdatePermission?: (userId: string, canEdit: boolean) => void;
}

const CollaboratorList: React.FC<CollaboratorListProps> = ({
  collaborators,
  isOwner,

  onRemove,
  onUpdatePermission,
}) => {
  const [newCollaborator, setNewCollaborator] = useState({
    email: "",
    canEdit: false,
  });

  const handleTogglePermission = (collaborator: Collaborator) => {
    if (onUpdatePermission && isOwner) {
      onUpdatePermission(collaborator.userId, !collaborator.canEdit);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Collaborators
        </h3>
      </div>

      {/* Collaborators list */}
      {collaborators.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-4">
          No collaborators yet.
        </p>
      ) : (
        <div className="space-y-3">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {collaborator.user.fullName}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {collaborator.user.email}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Added {formatDate(collaborator.createdAt)}
                </div>
              </div>
              <div className="flex items-center">
                {isOwner ? (
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`permission-${collaborator.id}`}
                      checked={collaborator.canEdit}
                      onChange={() => handleTogglePermission(collaborator)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={!isOwner}
                    />
                    <label
                      htmlFor={`permission-${collaborator.id}`}
                      className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      Can Edit
                    </label>
                  </div>
                ) : (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      collaborator.canEdit
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {collaborator.canEdit ? "Editor" : "Viewer"}
                  </span>
                )}
                {isOwner && (
                  <button
                    onClick={() => onRemove(collaborator.userId)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    aria-label={`Remove ${collaborator.user.fullName}`}
                    title={`Remove ${collaborator.user.fullName}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaboratorList;
