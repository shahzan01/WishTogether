import { Router } from "express";
import {
  createWishlist,
  getWishlists,
  getWishlistById,
  updateWishlist,
  deleteWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  updateItemInWishlist,
  addCollaborator,
  removeCollaborator,
  getCollaborators,
  addWishlistByPublicId,
  getWishlistByPublicId,
  updateCollaborator,
  getPublicWishlists,
} from "@/controllers/wishlist.controller";
import { verifyJWT } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  wishlistSchema,
  itemSchema,
  collaboratorSchema,
  addWishlistByPublicIdSchema,
  collaboratorUpdateSchema,
} from "@/schema/wishlist.schema";
import { updateCollaboratorService } from "@/services/wishlist.service";

const router = Router();

// Public routes (no authentication needed)
router.get("/public/:publicId", getWishlistByPublicId);

// Apply JWT verification to all remaining routes
router.use(verifyJWT);

// Add wishlist by public ID to dashboard
router.post(
  "/add-by-public-id",
  validate(addWishlistByPublicIdSchema, "body"),
  addWishlistByPublicId
);

// Wishlist routes
router.route("/").get(getWishlists);

router.route("/").post(validate(wishlistSchema, "body"), createWishlist);

router.route("/:id").get(getWishlistById).delete(deleteWishlist);
router.get("/all/public", getPublicWishlists);

router.patch("/:id", validate(wishlistSchema, "body"), updateWishlist);
// Item routes
router.route("/:id/items").post(validate(itemSchema), addItemToWishlist);

router
  .route("/:id/items/:itemId")
  .patch(validate(itemSchema, "body"), updateItemInWishlist)
  .delete(removeItemFromWishlist);

// Collaboration routes
router
  .route("/:id/collaborators")
  .get(getCollaborators)
  .post(validate(collaboratorSchema, "body"), addCollaborator);

router.route("/:id/collaborators/:userId").delete(removeCollaborator);
router
  .route("/:id/collaborators/:collaboratorId")
  .patch(validate(collaboratorUpdateSchema, "body"), updateCollaborator)
  .delete(removeCollaborator);

export default router;
