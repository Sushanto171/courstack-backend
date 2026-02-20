import { Router } from "express";
import { PERMISSIONS } from "../../config/permissions";
import authenticate from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import validateRequest from "../../middleware/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = Router()

router.get("/", categoryController.getAll);

router.get("/:slug", categoryController.getBySlug);

// for access only admin
router.post("/", validateRequest(categoryValidation.categorySchema), authenticate, authorize(PERMISSIONS.CATEGORY_CREATE), categoryController.create);

router.patch("/:id", validateRequest(categoryValidation.categorySchema), authenticate, authorize(PERMISSIONS.CATEGORY_UPDATE), categoryController.update)

export const categoryRoutes = router