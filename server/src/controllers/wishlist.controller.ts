import {
  createWishlistService,
  getWishlistsService,
  getWishlistByIdService,
  updateWishlistService,
  deleteWishlistService,
  addItemToWishlistService,
  removeItemFromWishlistService,
  updateItemInWishlistService,
  addCollaboratorService,
  removeCollaboratorService,
  getCollaboratorsService,
  addWishlistByPublicIdService,
  getWishlistByPublicIdService,
  updateCollaboratorService,
  getPublicWishlistsService,
} from "@/services/wishlist.service";

export const createWishlist = createWishlistService();
export const getWishlists = getWishlistsService();
export const getWishlistById = getWishlistByIdService();
export const updateWishlist = updateWishlistService();
export const deleteWishlist = deleteWishlistService();
export const addItemToWishlist = addItemToWishlistService();
export const removeItemFromWishlist = removeItemFromWishlistService();
export const updateItemInWishlist = updateItemInWishlistService();
export const addCollaborator = addCollaboratorService();
export const removeCollaborator = removeCollaboratorService();
export const getCollaborators = getCollaboratorsService();
export const addWishlistByPublicId = addWishlistByPublicIdService();
export const getWishlistByPublicId = getWishlistByPublicIdService();
export const getPublicWishlists = getPublicWishlistsService();
export const updateCollaborator = updateCollaboratorService();
