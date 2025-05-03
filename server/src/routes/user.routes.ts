import { Router } from "express";
import { me, signup } from "@/controllers/user.controller";
import { signin } from "@/controllers/user.controller";
import { signupSchema } from "@/schema/user.schema";

import { signinSchema } from "@/schema/user.schema";
import { validate } from "@/middlewares/validate.middleware";
import { verifyJWT } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/signup", validate(signupSchema, "body"), signup);
router.post("/signin", validate(signinSchema, "body"), signin);
router.get("/me", verifyJWT, me);

export default router;
