import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import accountRouter from "./src/routes/account.route";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/account", accountRouter);

export default app;
