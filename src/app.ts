import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from 'dotenv'
import express, { Application } from "express"
import helmet from "helmet"
import config from "./app/config"
import { globalError } from "./app/middleware/globalError"
import { httpLogger } from "./app/middleware/httpLogger"
import { notFound } from "./app/middleware/notFound"
import router from "./app/routes"

dotenv.config();

const app: Application = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: [config.FRONTEND_URL,]
}))
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger)


app.use("/api/v1", router);


app.get("/", (req, res) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = new Date().toLocaleString("en-US", { timeZone: timezone });

  res.send(`Courstack running... Timezone: ${timezone} Current Time: ${currentTime}`);
})

app.use(notFound)

app.use(globalError)

export default app