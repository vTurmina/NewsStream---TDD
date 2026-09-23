import User from '../../modules/user/user.model.js';
import News from '../../modules/news/news.model.js';
import Comment from '../../modules/interactions/comment.model.js';
import Like from '../../modules/interactions/like.model.js';

/* USER -> NEWS */

News.belongsTo(User, {
    foreignKey: 'userId'
});

User.hasMany(News, {
    foreignKey: 'userId'
});

/* NEWS -> COMMENT */

News.hasMany(Comment, {
    foreignKey: 'newsId'
});

Comment.belongsTo(News, {
    foreignKey: 'newsId'
});

/* USER -> COMMENT */

Comment.belongsTo(User, {
    foreignKey: 'userId'
});

User.hasMany(Comment, {
    foreignKey: 'userId'
});

/* NEWS -> LIKE */

News.hasMany(Like, {
    foreignKey: 'newsId'
});

Like.belongsTo(News, {
    foreignKey: 'newsId'
});

/* USER -> LIKE */

Like.belongsTo(User, {
    foreignKey: 'userId'
});

User.hasMany(Like, {
    foreignKey: 'userId'
});