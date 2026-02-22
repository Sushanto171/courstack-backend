import { Router } from "express"
import { PERMISSIONS } from "../../config/permissions"
import authenticate from "../../middleware/authenticate"
import { authorize } from "../../middleware/authorize"
import validateRequest from "../../middleware/validateRequest"
import { enrollController } from "./enrollment.controller"
import { enrollmentValidation } from "./enrollment.validation"

const router = Router()

router.use(authenticate)

router.get("/my-enrollments", authorize(PERMISSIONS.ENROLLMENT_VIEW_OWN), enrollController.getEnrolledByStudentId);

router.post("/", validateRequest(enrollmentValidation.enrollSchema), authorize(PERMISSIONS.ENROLLMENT_JOIN), enrollController.create);

export const enrollmentRoutes = router