import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import errorMiddleware from "./middleware/error.middleware";

const app: Application = express();

app.use(express.json());

app.use(cors());

app.use("/api", routes );

app.use(errorMiddleware);

export default app;