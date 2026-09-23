import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';
import * as userService from '../user.service.js';
import * as userController from '../user.controller.js';

vi.mock('../user.service.js');

describe('User Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Register', () => {
        it('deve redirecionar para /login com sucesso', async () => {
            userService.register.mockResolvedValueOnce({
                message: 'Usuário criado com sucesso!'
            });

            const response = await request(app)
                .post('/register')
                .send({
                    username: 'teste',
                    email: 'teste@test.com',
                    password: '12345678',
                    confirmPassword: '12345678'
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/login');
        });

        it('deve redirecionar para /register em caso de erro', async () => {
            userService.register.mockRejectedValueOnce(
                new Error('As senhas não coincidem.')
            );

            const response = await request(app)
                .post('/register')
                .send({
                    username: 'teste',
                    email: 'teste@test.com',
                    password: '12345678',
                    confirmPassword: '1234678'
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/register');
        });
    });

    describe('Login', () => {
        it('deve fazer login com sucesso e redirecionar para /feed', async () => {
            userService.login.mockResolvedValueOnce({
                id: 1,
                username: 'teste'
            });

            const response = await request(app)
                .post('/login')
                .send({
                    login: 'teste',
                    password: '12345678'
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
        });

        it('deve redirecionar para /login quando o login falhar', async () => {
            userService.login.mockRejectedValueOnce(
                new Error('E-mail, usuário, ou senha incorretos, favor verificar credênciais!')
            );

            const response = await request(app)
                .post('/login')
                .send({
                    login: 'teste',
                    password: 'senhaErrada'
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/login');
        });
    });

    describe('Logout', () => {
        it('deve destruir a sessão e redirecionar para /', () => {
            const req = {
                session: {
                    destroy: vi.fn((callback) => callback(null))
                }
            };

            const res = {
                redirect: vi.fn()
            };

            userController.logout(req, res);

            expect(req.session.destroy).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/');
        });

        it('deve redirecionar para /feed se ocorrer erro ao destruir a sessão', () => {
            const req = {
                session: {
                    destroy: vi.fn((callback) => callback(new Error('Erro ao sair')))
                }
            };

            const res = {
                redirect: vi.fn()
            };

            userController.logout(req, res);

            expect(req.session.destroy).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/feed');
        });
    });
});