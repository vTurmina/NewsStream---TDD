import * as newsService from './news.service.js';
import News from './news.model.js';
import Comment from '../interactions/comment.model.js';

export const createNews = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const result = await newsService.createNews(req.body, userId, News);

        req.flash('success', result.message);
        res.redirect('/feed');

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/feed');
    }
};

export const getFeed = async (req, res) => {
    try {
        const news = await newsService.getAllNews(News);

        res.render('pages/feed', {
            title: 'Feed',
            news
        });

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/');
    }
};

export const getNewsById = async (req, res) => {
    try {
          const { id } = req.params;

          const news = await newsService.getNewsById(id, News, Comment);

          res.render('pages/news-details', {
            title: news.title,
            news
          });

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/feed');
    }
};

export const deleteNews = async (req, res) => {
    try {
        const  { id } = req.params;
        const userId = req.session.user.id;

        await newsService.deleteNews(id, userId, News);

        req.flash('success', 'Notícia apagada');
        res.redirect('/feed');

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/feed');
    }
}

export const renderCreateNews = (req, res) => {
    res.render('pages/create-news', {
        title: 'Publicar notícia'
    });
};