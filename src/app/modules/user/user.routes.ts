import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";


const router = Router();

router.get("/", userController.getUsersFromDB)

router.post("/", validateRequest(userValidation.createUser), userController.createUser)

// only super_admin can access
router.post("/create-admin", validateRequest(userValidation.createUser), userController.createUser)

export const userRoutes = router;