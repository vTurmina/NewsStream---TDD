import express from 'express';
import * as newsController from './news.controller.js';
import isAuthenticad from '../../middlewares/auth.js';

const router = express.Router();

router.get('/news/create', isAuthenticad, newsController.renderCreateNews);

router.post('/news/create',isAuthenticad, newsController.createNews);

router.get('/feed', isAuthenticad, newsController.getFeed);

router.get('/news/:id', newsController.getNewsById);

router.post('/news/delete/:id', isAuthenticad, newsController.deleteNews);

export default router;