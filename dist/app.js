import express from "express";
const app = express();
app.get("/", (req, res) => {
    res.send("Courstack running...");
});
export default app;
