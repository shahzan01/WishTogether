import { Request, Response } from "express";
import {
  meService,
  signinService,
  signupService,
} from "@/services/user.service";

export const signup = signupService();
export const signin = signinService();
export const me = meService();
