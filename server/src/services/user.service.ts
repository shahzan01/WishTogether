import { Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/config/db.config";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@/utils/ApiResponse";
import jwt from "jsonwebtoken";

export const signupService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { email, password, fullName } = req.body;
    if ([fullName, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, fullName },
    });
    if (!user) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    res.status(201).json(
      new ApiResponse(
        201,
        {
          data: {
            user: { id: user.id, email: user.email, fullName: user.fullName },
          },
        },
        "User registered Successfully"
      )
    );
  });
};

export const signinService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("token", token, options);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          data: {
            token,
            user: { id: user.id, email: user.email, fullName: user.fullName },
          },
        },
        "User logged in Successfully"
      )
    );
  });
};

export const meService = () => {
  return asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: { email: user.email, id: user.id } },
          "User details"
        )
      );
  });
};
