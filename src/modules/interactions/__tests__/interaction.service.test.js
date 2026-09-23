import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as interactionService from '../interaction.service.js';

describe('Interaction Serice', () => {
    let mockLikeModel;
    let mockCommentModel;

    beforeEach(() => {
        mockLikeModel = {
            findOne: vi.fn(),
            create: vi.fn()
        };

        mockCommentModel = {
            findByPk: vi.fn(),
            create: vi.fn()
        };
    });

    describe('toggleLike', () => {
        it('Deve curtir uma noticia se ainda não estiver curtida', async () => {
            mockLikeModel.findOne.mockResolvedValueOnce(null);
            mockLikeModel.create.mockResolvedValueOnce( { id: 1});

            const result = await interactionService.toggleLike( 1 , 1, mockLikeModel);

            expect(result.message).toBe('Curtida realizada');
            expect(mockLikeModel.create).toHaveBeenCalledWith({
                newsId: 1,
                userId: 1
            });
        });

        it('Deve remover a curtida se já existir', async () => {
            const mockLike = {
                destroy: vi.fn()
            };

            mockLikeModel.findOne.mockResolvedValueOnce(mockLike);

            const result = await interactionService.toggleLike(1, 1, mockLikeModel);

            expect(result.message).toBe('Curtida removida');
            expect(mockLike.destroy).toHaveBeenCalled();
        });
    });

    describe('commentNews', () => {
        it('Deve comentar em uma noticía com sucesso', async () => {
            mockCommentModel.create.mockResolvedValueOnce({ id: 1, content: 'Teste'});

            const result = await interactionService.commentNews('Teste', 1, 1, mockCommentModel);

            expect(result.message).toBe('Você compartilhou sua opinião nesse post')
        });

        it('Deve retornar erro se o comentário estiver vazio', async () => {
            await expect (interactionService.commentNews('', 1, 1, mockCommentModel))
            .rejects.toThrow('Comentário inválido');
        });
    });

    describe('deleteComment', () => {
        it('Deve excluir o comentário apenas do próprio usuário', async () => {
            const mockComment = {
                userId: 1,
                destroy: vi.fn()
            };

            mockCommentModel.findByPk.mockResolvedValueOnce(mockComment);

            const result = await interactionService.deleteComment(1, 1, mockCommentModel);

            expect(result.message).toBe('Comentário excluído');
            expect(mockComment.destroy).toHaveBeenCalled();
        });

        it('Deve retornar mensagem de erro se o comentário não existir', async () => {
            mockCommentModel.findByPk.mockResolvedValueOnce(null);

            await expect (interactionService.deleteComment(1, 1, mockCommentModel))
            .rejects.toThrow('Comentário não encontrado');
        });

        it('Deve impedir a exclusão de comentário por outro usuário', async () => {
            const mockComment = {
                userId: 2,
                destroy: vi.fn()
            };

            mockCommentModel.findByPk.mockResolvedValueOnce(mockComment);

            await expect( interactionService.deleteComment(1, 1, mockCommentModel))
            .rejects.toThrow('Você não pode excluir esse comentário');
        });
    });
});