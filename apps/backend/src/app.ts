import express from "express";
import routes from "./routes/index.routes";
import cors from "cors";
import config from "./config/config";
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.origin,
  })
);
// Routes
app.use("/", routes);

export default app;
