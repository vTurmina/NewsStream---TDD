import 'dotenv/config';
import sequelize from './config/database/database.js';
import './config/database/associations.js';
import app from './app.js';
const PORT = process.env.PORT || 3000;

try {
    await sequelize.authenticate();
    console.log('Banco conectado com sucesso');

    await sequelize.sync({ alter: true });
    console.log('Tabelas sincronizadas');

    app.listen(PORT, () => {
        console.log(`NewsStream rodando em http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    process.exit(1);
}