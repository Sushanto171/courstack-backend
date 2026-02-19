import { Router } from "express";
import authenticate from "../../middleware/authenticate";
import validateRequest from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";


const router = Router();

router.get("/me", authenticate, authController.getMe)

router.post("/login", validateRequest(authValidation.loginSchema), authController.login)

export const authRoutes = router