import { Router } from "express";
import userRoutes from "@/routes/user.routes";
import wishlistRoutes from "@/routes/wishlist.routes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/wishlists", wishlistRoutes);
export default router;
