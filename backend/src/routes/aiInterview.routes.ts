import express from 'express';
const router = express.Router();

import { githubRouter } from '../controllers/github.controller';
import { authMiddleware } from '../middleware/auth.middleware';

router.use(authMiddleware);


router.post('/github', githubRouter);

export default router;
