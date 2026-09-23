import { DataTypes } from 'sequelize';
import sequelize from '../../config/database/database.js';

const News = sequelize.define('News', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default News;