import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';

import * as newsService from '../news.service.js';
import * as userService from '../../user/user.service.js';

vi.mock('../news.service.js');
vi.mock('../../user/user.service.js');
vi.mock('../../interactions/comment.model.js', () => ({
    default: {}
}));

describe('News Controller', () => {
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


    describe('createNews', () => {
        it('Deve redirecionar para /feed quando criar a notícia', async () => {
            const agent = await loginAgent();
            newsService.createNews.mockResolvedValueOnce({
                message: 'Notícia postada'
            });

            const response = await agent
                .post('/news/create')
                .send({
                    title: 'Titulo teste',
                    content: 'Conteúdo teste',
                    categoryId: 1
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
        });

        it('Deve redirecionar para /feed em caso de erro', async () => {
            const agent = await loginAgent();
            newsService.createNews.mockRejectedValueOnce(new Error('Erro ao postar notícia'));

            const response = await agent
                .post('/news/create')
                .send({
                    title: '',
                    content: ''
                });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
        });
    });

    describe('getFeed', () => {
        it('Deve retornar o feed com as notícias', async () => {
            const agent = await loginAgent();


            newsService.getAllNews.mockResolvedValueOnce([{
                id: 1,
                title: 'teste noticia',
                content: 'conteúdo teste',
                category: 'Tecnologia'
            }]);

            const response = await agent.get('/feed');

            expect(response.status).toBe(200);
        })

        it('deve redirecionar para login sem autenticação', async () => {
            const response = await request(app)
                .get('/feed');

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/login');
        });
    })

    describe('getNewsById', () => {
        it('Deve renderizar a noticia especifica', async () => {
            newsService.getNewsById.mockResolvedValueOnce({
                id: 1,
                title: 'teste noticia',
                content: 'Conteúdo teste',
                category: 'Tecnologia',
                userId: 1,
                Comments: [{
                    id: 1,
                    content: 'Comentário teste',
                    userId: 1,
                    newsId: 1
                }]
            });

            const response = await request(app).get('/news/1');

            expect(response.status).toBe(200);

            expect(newsService.getNewsById).toHaveBeenCalledWith(
                '1',
                expect.anything(),
                expect.anything()
            )
        })
    })

    describe('deleteNews', () => {
        it('Deve redirecionar para /feed ao excluir notícia', async () => {
            const agent = await loginAgent();

            newsService.deleteNews.mockResolvedValueOnce({
                message: 'Notícia apagada'
            })

            const response = await agent.post('/news/delete/1');

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
        });

        it('Deve redirecionar para feed em caso de erro', async () => {
            const agent = await loginAgent();

            newsService.deleteNews.mockRejectedValueOnce(
                new Error('Erro ao excluir')
            );

            const response = await agent.post('/news/delete/1')

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/feed');
        })
    })
});