import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";


const router = Router();

router.post("/login", validateRequest(authValidation.loginSchema), authController.login)

export const authRoutes = router