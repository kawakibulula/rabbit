import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import todoRoute from "./router/todoRoute.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3030;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(todoRoute);
app.listen(port, () => {
  console.log("server running on", port);
});
