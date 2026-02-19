import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validation";


const router = Router();

router.get("/", userController.getUsersFromDB)

router.post("/", validateRequest(userValidation.createUser),  userController.createUser)

export const userRoutes = router