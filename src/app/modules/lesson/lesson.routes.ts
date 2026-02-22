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

router.get("/:lessonId", authorize(PERMISSIONS.LESSON_VIEW), lessonController.getOneLessonByLessonId);

router.post("/", validateRequest(lessonValidation.createLesson), authorize(PERMISSIONS.LESSON_CREATE), lessonController.create);


router.patch("/:lessonId/status", validateRequest(lessonValidation.updateLessonStatus), authorize(PERMISSIONS.LESSON_UPDATE), lessonController.updateLessonStatusByLessonId)

router.patch("/:lessonId", validateRequest(lessonValidation.updateLesson), authorize(PERMISSIONS.LESSON_UPDATE), lessonController.updateByLessonId);

router.delete("/:lessonId", authorize(PERMISSIONS.LESSON_DELETE), lessonController.deleteOne);

router.post("/:lessonId/progress", validateRequest(lessonValidation.lessonProgress), authorize(PERMISSIONS.ENROLLMENT_UPDATE_OWN_PROGRESS), lessonController.lessonCompleted);


export const lessonRoutes = router