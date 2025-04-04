import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import accountRouter from "./src/routes/account.route";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/account", accountRouter);

export default app;
