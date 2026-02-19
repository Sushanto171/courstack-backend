import { Router } from "express";

interface Routes {
  router: Router;
  path: string;
}

const router = Router();

const routes: Routes[] = [];

routes.forEach((route) => router.use(route.path, route.router));

export default router;