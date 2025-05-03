import api from "./axios";

export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  url?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
  updatedBy: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface Collaborator {
  id: string;
  wishlistId: string;
  userId: string;
  canEdit: boolean;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface Wishlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  publicId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
  updatedBy: {
    id: string;
    fullName: string;
    email: string;
  };
  items: WishlistItem[];
  collaborators: Collaborator[];
}

export interface CreateWishlistData {
  name: string;
  description?: string;
  isPublic: boolean;
}

export interface UpdateWishlistData {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface CreateItemData {
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  url?: string;
}

export interface AddCollaboratorData {
  userId: string;
  canEdit: boolean;
}

// Wishlist API Methods
const wishlistService = {
  // Get all wishlists
  getWishlists: async (): Promise<Wishlist[]> => {
    const response = await api.get("/wishlists");
    return response.data.data.data.wishlists;
  },

  // Get all public wishlists
  getPublicWishlists: async (): Promise<Wishlist[]> => {
    const response = await api.get("/wishlists/all/public");
    console.log(response.data);
    return response.data.data.data.wishlists;
  },

  // Get a wishlist by ID
  getWishlistById: async (id: string): Promise<Wishlist> => {
    const response = await api.get(`/wishlists/${id}`);
    return response.data.data.data.wishlist;
  },

  // Get a wishlist by public ID (no auth required)
  getWishlistByPublicId: async (publicId: string): Promise<Wishlist> => {
    const response = await api.get(`/wishlists/public/${publicId}`);
    return response.data.data.data.wishlist;
  },

  // Create a new wishlist
  createWishlist: async (data: CreateWishlistData): Promise<Wishlist> => {
    const response = await api.post("/wishlists", data);
    return response.data.data.data.wishlist;
  },

  // Update a wishlist
  updateWishlist: async (
    id: string,
    data: UpdateWishlistData
  ): Promise<Wishlist> => {
    const response = await api.patch(`/wishlists/${id}`, data);
    return response.data.data.data.wishlist;
  },

  // Delete a wishlist
  deleteWishlist: async (id: string): Promise<void> => {
    await api.delete(`/wishlists/${id}`);
  },

  // Add a wishlist to dashboard by public ID
  addWishlistByPublicId: async (publicId: string): Promise<Wishlist> => {
    const response = await api.post("/wishlists/add-by-public-id", {
      publicId,
    });
    return response.data.data.data.wishlist;
  },

  // Item Methods
  addItemToWishlist: async (
    wishlistId: string,
    data: CreateItemData
  ): Promise<WishlistItem> => {
    console.log("API call - addItemToWishlist:", { wishlistId, data });
    try {
      const response = await api.post(`/wishlists/${wishlistId}/items`, data);
      console.log("API response:", response.data);
      return response.data.data.data.item;
    } catch (error) {
      console.error("API error in addItemToWishlist:", error);
      throw error;
    }
  },

  updateItem: async (
    wishlistId: string,
    itemId: string,
    data: CreateItemData
  ): Promise<WishlistItem> => {
    const response = await api.patch(
      `/wishlists/${wishlistId}/items/${itemId}`,
      data
    );
    return response.data.data.data.item;
  },

  deleteItem: async (wishlistId: string, itemId: string): Promise<void> => {
    await api.delete(`/wishlists/${wishlistId}/items/${itemId}`);
  },

  // Collaborator Methods
  getCollaborators: async (wishlistId: string): Promise<Collaborator[]> => {
    const response = await api.get(`/wishlists/${wishlistId}/collaborators`);
    return response.data.data.data.collaborators;
  },

  addCollaborator: async (
    wishlistId: string,
    data: AddCollaboratorData
  ): Promise<Collaborator> => {
    const response = await api.post(
      `/wishlists/${wishlistId}/collaborators`,
      data
    );
    return response.data.data.data.collaborator;
  },

  updateCollaboratorPermission: async (
    wishlistId: string,
    userId: string,
    canEdit: boolean
  ): Promise<Collaborator> => {
    const response = await api.patch(
      `/wishlists/${wishlistId}/collaborators/${userId}`,
      { canEdit }
    );
    return response.data.data.data.collaborator;
  },

  removeCollaborator: async (
    wishlistId: string,
    userId: string
  ): Promise<void> => {
    await api.delete(`/wishlists/${wishlistId}/collaborators/${userId}`);
  },
};

export default wishlistService;
