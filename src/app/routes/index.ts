import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/category/category.routes";
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
];

routes.forEach((route) => router.use(route.path, route.router));

export default router;