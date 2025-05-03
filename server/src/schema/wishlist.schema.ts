import { z } from "zod";

export const wishlistSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
});

export const itemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().min(0).optional(),
  url: z.string().url().optional(),
});

export const collaboratorSchema = z.object({
  userId: z.string().uuid(),
  canEdit: z.boolean().default(false),
});

export const collaboratorUpdateSchema = z.object({
  canEdit: z.boolean().default(false),
});

// Schema for adding a wishlist by public ID
export const addWishlistByPublicIdSchema = z.object({
  publicId: z.string().min(1, "Public ID is required"),
});

export type WishlistSchema = z.infer<typeof wishlistSchema>;
export type ItemSchema = z.infer<typeof itemSchema>;
export type CollaboratorSchema = z.infer<typeof collaboratorSchema>;
export type AddWishlistByPublicIdSchema = z.infer<
  typeof addWishlistByPublicIdSchema
>;
