import cors from "cors";
import express from "express";
import { globalError } from "./app/middleware/globalError";
import { notFound } from "./app/middleware/notFound";
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("Courstack running...");
});
app.use(notFound);
app.use(globalError);
export default app;
