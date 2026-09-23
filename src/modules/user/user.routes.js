import express from 'express';
import isAuthenticad from '../../middlewares/auth.js';
const router = express.Router();

import * as userController from './user.controller.js';

router.get('/register', (req, res) => {
    res.render('pages/register', {title: 'Criar Conta' });
});

router.post('/register', userController.register);

router.get('/login', (req, res) => {
    res.render('pages/login', {title: 'Entrar'});
});

router.post('/login', userController.login);

router.get('/logout', userController.logout);



export default router;