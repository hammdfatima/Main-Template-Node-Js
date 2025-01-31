import { Router } from "express";
import AUTH_ROUTER from "~/v1/routes/auth/auth-routes";

const MAIN_ROUTER = Router();
MAIN_ROUTER.use("/auth", AUTH_ROUTER);

export default MAIN_ROUTER;
