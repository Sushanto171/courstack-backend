import { Router } from "express";
import authenticate from "../../middleware/authenticate";
import { statsController } from "./stats.controller";

const router = Router()

router.get("/", authenticate, statsController.getStats)

export const statsRoutes = router