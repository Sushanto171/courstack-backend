import express, { Application } from "express"

const app: Application = express()

app.get("/", (req, res) => {
  res.send("Courstack running...")
})

export default app