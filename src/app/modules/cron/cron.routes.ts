import { Router } from "express"
import config from "../../config"
import { cronJob } from "./cron.service"

const router = Router()
router.get("/run", async (req, res) => {
  const secret = req.headers["x-cron-secret"]
  if (secret !== config.CRON_SECRET) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  await cronJob()
  res.json({ success: true })
})

export const cronRoutes = router