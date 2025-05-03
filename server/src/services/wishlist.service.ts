import { Request, Response } from "express";
import { prisma } from "@/config/db.config";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import {
  itemSchema,
  collaboratorSchema,
  collaboratorUpdateSchema,
} from "@/schema/wishlist.schema";
import { v4 as uuidv4 } from "uuid";

export const createWishlistService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { name, description, isPublic } = req.body;
    const user = req.user!;

    const publicId = uuidv4();

    const wishlist = await prisma.wishlist.create({
      data: {
        name,
        description,
        isPublic,
        userId: user.id,
        publicId: isPublic ? (publicId as string) : undefined,
      },
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { data: { wishlist: { ...wishlist, user: user } } },
          "Wishlist created successfully"
        )
      );
  });
};

export const getWishlistsService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;

    // Get wishlists owned by the user
    const ownedWishlists = await prisma.wishlist.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Get wishlists where user is a collaborator
    const collaborativeWishlists = await prisma.wishlist.findMany({
      where: {
        collaborators: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Combine both types of wishlists
    const wishlists = [...ownedWishlists, ...collaborativeWishlists];

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { wishlists } },
          "Wishlists retrieved successfully"
        )
      );
  });
};

export const getWishlistByIdService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user!;

    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          { isPublic: true },
          {
            collaborators: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
      include: {
        items: {
          include: {
            createdBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            updatedBy: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { wishlist } },
          "Wishlist retrieved successfully"
        )
      );
  });
};

export const updateWishlistService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;
    const user = req.user!;
    console.log(isPublic);
    // Check if user is owner or has edit permissions
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          {
            collaborators: {
              some: {
                userId: user.id,
                canEdit: true,
              },
            },
          },
        ],
      },
    });

    if (!wishlist) {
      throw new ApiError(
        404,
        "Wishlist not found or you don't have permission to edit"
      );
    }

    const updatedWishlist = await prisma.wishlist.update({
      where: { id },
      data: {
        name,
        description,
        isPublic,
        publicId: isPublic && !wishlist.publicId ? uuidv4() : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { wishlist: updatedWishlist } },
          "Wishlist updated successfully"
        )
      );
  });
};

export const deleteWishlistService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user!;

    // Only the owner can delete a wishlist
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found or you're not the owner");
    }

    await prisma.wishlist.delete({
      where: { id },
    });

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Wishlist deleted successfully"));
  });
};

export const addItemToWishlistService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user!;
    const itemData = itemSchema.parse(req.body);

    // Check if user is owner or has edit permissions
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          {
            collaborators: {
              some: {
                userId: user.id,
                canEdit: true,
              },
            },
          },
        ],
      },
    });

    if (!wishlist) {
      throw new ApiError(
        404,
        "Wishlist not found or you don't have permission to add items"
      );
    }

    const item = await prisma.item.create({
      data: {
        ...itemData,
        createdById: user.id,
        updatedById: user.id,
        wishlistId: id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { data: { item } },
          "Item added to wishlist successfully"
        )
      );
  });
};

export const removeItemFromWishlistService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id, itemId } = req.params;
    const user = req.user!;

    // Check if user is owner or has edit permissions
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          {
            collaborators: {
              some: {
                userId: user.id,
                canEdit: true,
              },
            },
          },
        ],
      },
    });

    if (!wishlist) {
      throw new ApiError(
        404,
        "Wishlist not found or you don't have permission to remove items"
      );
    }

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        wishlistId: id,
      },
    });

    if (!item) {
      throw new ApiError(404, "Item not found");
    }

    await prisma.item.delete({
      where: { id: itemId },
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Item removed from wishlist successfully")
      );
  });
};

export const updateItemInWishlistService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id, itemId } = req.params;
    const user = req.user!;
    const itemData = itemSchema.parse(req.body);

    // Check if user is owner or has edit permissions
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          {
            collaborators: {
              some: {
                userId: user.id,
                canEdit: true,
              },
            },
          },
        ],
      },
    });

    if (!wishlist) {
      throw new ApiError(
        404,
        "Wishlist not found or you don't have permission to update items"
      );
    }

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        wishlistId: id,
      },
    });

    if (!item) {
      throw new ApiError(404, "Item not found");
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        ...itemData,
        updatedById: user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { item: updatedItem } },
          "Item updated successfully"
        )
      );
  });
};

// New function to add wishlist to dashboard by public ID
export const addWishlistByPublicIdService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { publicId } = req.body;
    const user = req.user!;

    if (!publicId) {
      throw new ApiError(400, "Wishlist public ID is required");
    }

    // Find the wishlist by public ID without including collaborators
    const wishlist = await prisma.wishlist.findUnique({
      where: { publicId },
    });

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found");
    }

    // Check if the user is already a collaborator
    const existingCollaborator = await prisma.wishlistCollaborator.findUnique({
      where: {
        wishlistId_userId: {
          wishlistId: wishlist.id,
          userId: user.id,
        },
      },
    });

    if (existingCollaborator) {
      throw new ApiError(
        400,
        "You are already a collaborator on this wishlist"
      );
    }

    // Check if user is the owner
    if (wishlist.userId === user.id) {
      throw new ApiError(400, "You already own this wishlist");
    }

    // Add user as collaborator
    const collaborator = await prisma.wishlistCollaborator.create({
      data: {
        wishlistId: wishlist.id,
        userId: user.id,
        canEdit: false, // Default to read-only access
      },
      include: {
        wishlist: {
          include: {
            items: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { data: { wishlist: collaborator.wishlist } },
          "Wishlist added to your dashboard successfully"
        )
      );
  });
};

// New function to get wishlist by public ID without authentication
export const getWishlistByPublicIdService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { publicId } = req.params;

    if (!publicId) {
      throw new ApiError(400, "Wishlist public ID is required");
    }

    // Find the wishlist by public ID
    const wishlist = await prisma.wishlist.findUnique({
      where: { publicId },
      include: {
        items: {
          include: {
            createdBy: true,
            updatedBy: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        collaborators: true,
        createdBy: true,
        updatedBy: true,
      },
    });

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found");
    }

    // Ensure the wishlist is public
    if (!wishlist.isPublic) {
      throw new ApiError(403, "This wishlist is private");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { wishlist } },
          "Wishlist retrieved successfully"
        )
      );
  });
};

// Add collaborator to a wishlist
export const addCollaboratorService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user!;
    const collaboratorData = collaboratorSchema.parse(req.body);

    // Only the owner can add collaborators
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found or you're not the owner");
    }

    // Check if user exists
    const collaboratorUser = await prisma.user.findUnique({
      where: { id: collaboratorData.userId },
    });

    if (!collaboratorUser) {
      throw new ApiError(404, "User not found");
    }

    // Check if user is already a collaborator
    const existingCollaborator = await prisma.wishlistCollaborator.findUnique({
      where: {
        wishlistId_userId: {
          wishlistId: id,
          userId: collaboratorData.userId,
        },
      },
    });

    if (existingCollaborator) {
      // Update existing collaborator permissions
      const updatedCollaborator = await prisma.wishlistCollaborator.update({
        where: {
          wishlistId_userId: {
            wishlistId: id,
            userId: collaboratorData.userId,
          },
        },
        data: {
          canEdit: collaboratorData.canEdit,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { data: { collaborator: updatedCollaborator } },
            "Collaborator permissions updated successfully"
          )
        );
    }

    // Create new collaborator
    const collaborator = await prisma.wishlistCollaborator.create({
      data: {
        wishlistId: id,
        userId: collaboratorData.userId,
        canEdit: collaboratorData.canEdit,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { data: { collaborator } },
          "Collaborator added successfully"
        )
      );
  });
};

// Remove collaborator from wishlist
export const removeCollaboratorService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    const user = req.user!;

    // Only the owner can remove collaborators
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found or you're not the owner");
    }

    // Check if collaborator exists
    const collaborator = await prisma.wishlistCollaborator.findUnique({
      where: {
        wishlistId_userId: {
          wishlistId: id,
          userId,
        },
      },
    });

    if (!collaborator) {
      throw new ApiError(404, "Collaborator not found");
    }

    await prisma.wishlistCollaborator.delete({
      where: {
        wishlistId_userId: {
          wishlistId: id,
          userId,
        },
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Collaborator removed successfully"));
  });
};

// Get collaborators for a wishlist
export const getCollaboratorsService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user!;

    // Check if user has access to the wishlist
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          { isPublic: true },
          {
            collaborators: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
    });

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found or you don't have access");
    }

    const collaborators = await prisma.wishlistCollaborator.findMany({
      where: { wishlistId: id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { collaborators } },
          "Collaborators retrieved successfully"
        )
      );
  });
};

// Update collaborator permissions
export const updateCollaboratorService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { id, collaboratorId } = req.params;
    const user = req.user!;
    const collaboratorData = collaboratorUpdateSchema.parse(req.body);

    // Only the owner can update collaborator permissions
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found or you're not the owner");
    }

    const collaborator = await prisma.wishlistCollaborator.findUnique({
      where: {
        wishlistId_userId: {
          wishlistId: id,
          userId: collaboratorId,
        },
      },
    });

    if (!collaborator) {
      throw new ApiError(404, "Collaborator not found");
    }

    // Update collaborator permissions
    const updatedCollaborator = await prisma.wishlistCollaborator.update({
      where: {
        wishlistId_userId: {
          wishlistId: id,
          userId: collaboratorId,
        },
      },
      data: {
        canEdit: collaboratorData.canEdit,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { data: { data: { collaborator: updatedCollaborator } } } },
          "Collaborator permissions updated successfully"
        )
      );
  });
};

export const getPublicWishlistsService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const wishlists = await prisma.wishlist.findMany({
      where: { isPublic: true },
      include: {
        items: true,
        user: true,
        collaborators: true,
        createdBy: true,
        updatedBy: true,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { wishlists } },
          "Wishlists retrieved successfully"
        )
      );
  });
};
