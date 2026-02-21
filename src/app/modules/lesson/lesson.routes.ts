import { Router } from "express";
import { PERMISSIONS } from "../../config/permissions";
import authenticate from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import validateRequest from "../../middleware/validateRequest";
import { lessonController } from "./lesson.controller";
import { lessonValidation } from "./lesson.validation";

const router = Router({ mergeParams: true })

router.use(authenticate);

router.get("/", authorize(PERMISSIONS.LESSON_VIEW), lessonController.getLessonsByCourseId);

router.get("/:lessonId", authorize(PERMISSIONS.LESSON_VIEW), lessonController.getLessonsByCourseId);

router.post("/", validateRequest(lessonValidation.createLesson), authorize(PERMISSIONS.LESSON_CREATE), lessonController.create);


router.patch("/:lessonId", validateRequest(lessonValidation.updateLesson), authorize(PERMISSIONS.LESSON_UPDATE), lessonController.updateByLessonId)


export const lessonRoutes = router