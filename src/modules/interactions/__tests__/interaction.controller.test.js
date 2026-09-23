import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';

import * as interactionService from '../interaction.service.js';
import * as userService from '../../user/user.service.js';

vi.mock('../interaction.service.js');
vi.mock('../../user/user.service.js');

describe('Interaction Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const loginAgent = async () => {
        const agent = request.agent(app);

        userService.login.mockResolvedValueOnce({
            id: 1,
            username: 'teste',
            email: 'teste@test.com'
        });

        await agent
            .post('/login')
            .send({
                login: 'teste',
                password: '12345678'
            });

        return agent;
    };

    describe('toggleLike', () => {
        it('Deve redirecionar para /feed ao curtir ou remover curtida com sucesso', async () => {
            const agent = await loginAgent();

            interactionService.toggleLike.mockResolvedValueOnce({
                message: 'Curtida processada com sucesso'
            });

            const response = await agent
                .post('/like')
                .send({
                    newsId: 1
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
            expect(interactionService.toggleLike).toHaveBeenCalled();
        });

        it('Deve redirecionar para /feed em caso de erro ao curtir', async () => {
            const agent = await loginAgent();

            interactionService.toggleLike.mockRejectedValueOnce(
                new Error('Erro ao processar like')
            );

            const response = await agent
                .post('/like')
                .send({
                    newsId: 1
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
            expect(interactionService.toggleLike).toHaveBeenCalled();
        });
    });

    describe('commentNews', () => {
        it('Deve redirecionar para /feed ao comentar com sucesso', async () => {
            const agent = await loginAgent();

            interactionService.commentNews.mockResolvedValueOnce({
                message: 'Comentário criado com sucesso'
            });

            const response = await agent
                .post('/comment')
                .send({
                    newsId: 1,
                    content: 'Comentário teste'
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
            expect(interactionService.commentNews).toHaveBeenCalled();
        });

        it('Deve redirecionar para /feed em caso de erro ao comentar', async () => {
            const agent = await loginAgent();

            interactionService.commentNews.mockRejectedValueOnce(
                new Error('Erro ao comentar')
            );

            const response = await agent
                .post('/comment')
                .send({
                    newsId: 1,
                    content: 'Comentário teste'
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
            expect(interactionService.commentNews).toHaveBeenCalled();
        });
    });

    describe('deleteComment', () => {
        it('Deve redirecionar para /feed ao excluir comentário com sucesso', async () => {
            const agent = await loginAgent();

            interactionService.deleteComment.mockResolvedValueOnce({
                message: 'Comentário apagado'
            });

            const response = await agent
                .post('/comment/delete')
                .send({
                    commentId: 1
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
            expect(interactionService.deleteComment).toHaveBeenCalled();
        });

        it('Deve redirecionar para /feed em caso de erro ao excluir comentário', async () => {
            const agent = await loginAgent();

            interactionService.deleteComment.mockRejectedValueOnce(
                new Error('Erro ao excluir comentário')
            );

            const response = await agent
                .post('/comment/delete')
                .send({
                    commentId: 1
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
            expect(interactionService.deleteComment).toHaveBeenCalled();
        });
    });
});