import { Router } from "express";
import { PERMISSIONS } from "../../config/permissions";
import authenticate from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { upload } from "../../middleware/upload";
import validateRequest from "../../middleware/validateRequest";
import { courseController } from "./course.controller";
import { courseValidation } from "./course.validation";

const router = Router()

router.use(authenticate)



router.post("/", authorize(PERMISSIONS.COURSE_CREATE), upload.single("file"), validateRequest(courseValidation.createCourse), courseController.create)

export const courseRoutes = router