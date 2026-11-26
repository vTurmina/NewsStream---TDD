import express from 'express';
const router = express.Router();

import * as userController from './user.controller.js';

import { isAuthenticad } from '../../middlewares/auth.js';

router.get('/register', (req, res) => {
    res.render('pages/register', {title: 'Criar Conta' });
});

router.post('/register', userController.register);

router.get('/login', (req, res) => {
    res.render('pages/login', {title: 'Entrar'});
});

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/profile', isAuthenticad, userController.getProfile);



export default router;