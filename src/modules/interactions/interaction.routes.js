import express from 'express';
import * as interactionController from './interaction.controller.js';

const router = express.Router();

router.post('/like', interactionController.toggleLike);

router.post('/comment', interactionController.commentNews);

router.post('/comment/delete', interactionController.deleteComment);

export default router;