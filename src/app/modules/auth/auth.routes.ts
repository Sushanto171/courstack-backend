import { auditLogger } from "@/app/middleware/auditLogger";
import { Router } from "express";
import authenticate from "../../middleware/authenticate";
import validateRequest from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router = Router();

router.get("/me", authenticate, authController.getMe);

router.get("/refresh", authController.refreshToken);

router.get("/get-otp", authenticate, authController.getVerifyOtp)

router.post("/login", auditLogger("login"), validateRequest(authValidation.loginSchema), authController.login);

router.post("/verify", auditLogger("verify:email"), authenticate, validateRequest(authValidation.verifySchema), authController.verify);



export const authRoutes = router