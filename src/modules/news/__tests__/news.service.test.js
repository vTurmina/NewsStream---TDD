import { describe, it, beforeEach, vi, expect } from 'vitest';
import * as newsService from '../news.service.js';

describe('News Service', () => {
    let mockNewsModel;
    let mockCommentModel;

    beforeEach(() => {
        mockNewsModel = {
            create: vi.fn(),
            findAll: vi.fn(),
            findByPk: vi.fn()
        };

        mockCommentModel = {};
    });

    describe('createNews', () => {
        it('Deve criar as noticias com sucesso', async () => {
            const data = {
                title: 'Titulo teste',
                content: 'Conteúdo teste',
                categoryId: 1
            };

            mockNewsModel.create.mockResolvedValueOnce({
                id: 1,
                ...data,
                userId: 1
            });

            const result = await newsService.createNews(data, 1, mockNewsModel);

            expect(result.message).toBe('Notícia criada com sucesso');
            expect(mockNewsModel.create).toHaveBeenCalledWith({
                title: 'Titulo teste',
                content: 'Conteúdo teste',
                categoryId: 1,
                userId: 1
            });
        });

        it('Deve retornar erro se não tiver título', async () => {
            const data = {
                title: '',
                content: 'Conteúdo da notícia',
                categoryId: 1
            };

            await expect(newsService.createNews(data, 1, mockNewsModel))
                .rejects.toThrow('A notícia precisa de um título');
        });
    });

    describe('getAllNews', () => {
        it('Deve listar todas as notícias', async () => {
            mockNewsModel.findAll.mockResolvedValueOnce([
                {
                    id: 1,
                    title: 'Notícia 1',
                    content: 'Conteúdo teste',
                }
            ]);

            const result = await newsService.getAllNews(mockNewsModel);

            expect(result.length).toBe(1);
            expect(mockNewsModel.findAll).toHaveBeenCalled();
        });
    });

    describe('getNewsById', () => {
        it('Deve buscar notícia por id', async () => {
            mockNewsModel.findByPk.mockResolvedValueOnce({
                id: 1,
                title: 'Noticia 1',
                content: 'Conteúdo teste',
                Comments: [{
                    id: 1,
                    content: 'Comentário teste',
                    userId: 1,
                    newsId: 1
                }]
            });

            const result = await newsService.getNewsById(1, mockNewsModel, mockCommentModel);

            expect(result.id).toBe(1);
            expect(result.Comments).toHaveLength(1);
            expect(result.Comments[0].content).toBe('Comentário teste');

            expect(mockNewsModel.findByPk).toHaveBeenCalledWith(1, {
                include: [{ model: mockCommentModel }]
            });
        });

        it('Deve retornar erro se a notícia não existir', async () => {
            mockNewsModel.findByPk.mockResolvedValueOnce(null);

            await expect(newsService.getNewsById(1, mockNewsModel))
                .rejects.toThrow('Essa notícia não existe');
        });
    });



    describe('deleteNews', () => {
        it('Deve excluir uma noticia existente', async () => {
            const mockNews = {
                userId: 1,
                destroy: vi.fn()
            };

            mockNewsModel.findByPk.mockResolvedValueOnce(mockNews);

            const result = await newsService.deleteNews(1, 1, mockNewsModel);

            expect(result.message).toBe('Notícia apagada');
            expect(mockNews.destroy).toHaveBeenCalled();
        });

        it('Deve retornar erro caso não exista a notícia', async () => {
            mockNewsModel.findByPk.mockResolvedValueOnce(null);

            await expect(newsService.deleteNews(1, 1, mockNewsModel, mockCommentModel))
                .rejects.toThrow('Essa notícia não existe');
        });

        it('Deve impedir exclusão por outro usuário', async () => {
            const mockNews = {
                userId: 2,
                destroy: vi.fn()
            };

            mockNewsModel.findByPk.mockResolvedValueOnce(mockNews);

            await expect(
                newsService.deleteNews(1, 1, mockNewsModel)
            ).rejects.toThrow('Você não pode excluir essa notícia');
        });
    });
});
