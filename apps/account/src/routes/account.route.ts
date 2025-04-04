import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { authenticate } from "../share/authenicate.middleware";

const accountRouter = Router();

accountRouter.post("/register", AccountController.register);
accountRouter.post("/login", AccountController.login);
accountRouter.get("/logout", AccountController.logout);
accountRouter.get("/delete", authenticate, AccountController.deleteAccount);
accountRouter.get("/auto-login", authenticate, AccountController.autoLogin);

export default accountRouter;
