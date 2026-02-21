import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router()

router.post("/ipn", paymentController.paymentIpn)

export const paymentRoutes = router