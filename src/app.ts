import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from 'dotenv'
import express, { Application } from "express"
import { globalError } from "./app/middleware/globalError"
import { notFound } from "./app/middleware/notFound"
import router from "./app/routes"
import { cronJob } from "./app/jobs"

dotenv.config();

const app: Application = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

 cronJob()

app.get("/", (req, res) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = new Date().toLocaleString("en-US", { timeZone: timezone });

  res.send(`Courstack running... Timezone: ${timezone} Current Time: ${currentTime}`);
})

app.use(notFound)

app.use(globalError)

export default app