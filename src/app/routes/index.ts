import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { courseRoutes } from "../modules/course/course.routes";
import { enrollmentRoutes } from "../modules/enrollment/enrollment.routes";
import { lessonRoutes } from "../modules/lesson/lesson.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { userRoutes } from "../modules/user/user.routes";

interface Routes {
  router: Router;
  path: string;
}

const router = Router();

const routes: Routes[] = [
  {
    router: userRoutes,
    path: "/user"
  },
  {
    router: authRoutes,
    path: "/auth"
  },
  {
    router: categoryRoutes,
    path: "/category"
  },
  {
    router: courseRoutes,
    path: "/course"
  },
  {
    router: lessonRoutes,
    path: "/course/:courseId/lessons"
  },
  {
    router: enrollmentRoutes,
    path: "/enrollment"
  },
  {
    router: paymentRoutes,
    path: "/payment"
  },
];

routes.forEach((route) => router.use(route.path, route.router));

export default router;