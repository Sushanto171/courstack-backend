import { Router } from "express";
import { PERMISSIONS } from "../../config/permissions";
import authenticate from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { upload } from "../../middleware/upload";
import { validateQuery } from "../../middleware/validateQuery";
import validateRequest from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";


const router = Router();

router.get("/", validateQuery(userValidation.userQuerySchema), authenticate, authorize(PERMISSIONS.STUDENT_VIEW, PERMISSIONS.ADMIN_VIEW, PERMISSIONS.INSTRUCTOR_VIEW), userController.getUsersFromDB)

router.post("/", validateRequest(userValidation.createUser), userController.createUser)

router.patch("/:id", authenticate, authorize(PERMISSIONS.USER_UPDATE), upload.single("file"), validateRequest(userValidation.updateUser), userController.updateUser)

// only super_admin authorize access
router.post("/create-admin", authenticate, authorize(PERMISSIONS.ADMIN_CREATE), validateRequest(userValidation.createUser), userController.createAdmin)

// For super_admin and admin access only
router.patch("/update-status", validateRequest(userValidation.updateUserStatusSchema), authenticate, authorize(PERMISSIONS.USER_STATUS_UPDATE), userController.updateStatus)

export const userRoutes = router;