import { Router } from "express";
import { PERMISSIONS } from "../../config/permissions";
import authenticate from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { upload } from "../../middleware/upload";
import validateRequest from "../../middleware/validateRequest";
import { courseController } from "./course.controller";
import { courseValidation } from "./course.validation";

const router = Router()

router.get("/", courseController.getAll);

router.get("/my-courses", authenticate, authorize(PERMISSIONS.COURSE_VIEW_OWN, PERMISSIONS.ENROLLMENT_VIEW_STUDENTS), courseController.getMyCourses);

router.get("/:slug", courseController.getBySlug)

router.use(authenticate)

router.post("/", authorize(PERMISSIONS.COURSE_CREATE), upload.single("file"), validateRequest(courseValidation.createCourse), courseController.create);

router.patch("/status/:id", validateRequest(courseValidation.updateCourseStatus), authorize(PERMISSIONS.COURSE_STATUS_UPDATE), courseController.updateStatus);

router.patch("/:id", authorize(PERMISSIONS.COURSE_UPDATE_OWN), upload.single("file"), validateRequest(courseValidation.createCourse), courseController.update);

router.delete("/soft/:id", authorize(PERMISSIONS.COURSE_DELETE_OWN), courseController.softDelete);



export const courseRoutes = router