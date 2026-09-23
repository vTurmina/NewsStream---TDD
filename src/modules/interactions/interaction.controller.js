import * as interactionService from './interaction.service.js';
import Like from './like.model.js';
import Comment from './comment.model.js';

export const toggleLike = async (req, res) => {

    try {

        const { newsId } = req.body;
        const userId = req.session.user.id;
        const result = await interactionService.toggleLike(newsId, userId, Like);

        req.flash('success', result.message);
        res.redirect('/feed');

    } catch (error) {

        req.flash('error', error.message);
        res.redirect('/feed');
    }
};

export const commentNews = async (req, res) => {
    try {
        const { content, newsId } = req.body;


        const userId = req.session.user.id;

        await interactionService.commentNews(content, newsId, userId, Comment);

        req.flash('success', 'Você compartilhou sua opinião nesse post');
        res.redirect('/feed');

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/feed');
    }
};

export const deleteComment = async (req, res) => {
    try{
        const { commentId } = req.body;
        const userId = req.session.user.id;

        await interactionService.deleteComment(commentId, userId, Comment);
        req.flash('success', 'Comentário apagado');
        res.redirect('/feed');

    }catch (error) {
        req.flash('error', error.message);
        res.redirect('/feed');
    }
};

