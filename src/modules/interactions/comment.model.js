import { DataTypes } from 'sequelize';
import sequelize from '../../config/database/database.js';

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    newsId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default Comment;