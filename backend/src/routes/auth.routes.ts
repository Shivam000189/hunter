import { Router } from "express";
import { register, login, guestLogin, me, logout, setGithubUsername } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/guest", guestLogin);


router.get('/me', authMiddleware,  me);
router.post('/logout', authMiddleware, logout);
router.patch("/github", authMiddleware, setGithubUsername);

export default router;