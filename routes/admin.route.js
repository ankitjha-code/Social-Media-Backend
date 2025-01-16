import { Router } from "express";

import {
  adminLogin,
  adminFirstSetup,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/setup", adminFirstSetup);

export default adminRouter;
