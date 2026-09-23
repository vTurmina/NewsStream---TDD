//Função para validar os dados de uma notícia
const validateNewsData = ({ title, content }) => {
    if (!title || title.trim() === '') {
        throw new Error('A notícia precisa de um título');
    }

    if (!content || content.trim() === '') {
        throw new Error('Conteúdo obrigatório');
    }
};


//Função para criar um notícia
export const createNews = async (data, userId, newsModel) => {
    const { title, content, categoryId } = data;

    validateNewsData(data);

    const news = await newsModel.create({
        title,
        content,
        categoryId,
        userId
    });

    return {
        message: 'Notícia criada com sucesso', news
    };
};


//Função para pegar todas as notícias
export const getAllNews = async (newsModel) => {
    const news = await newsModel.findAll();
    if (!news) {
        throw new Error('Essa notícia não existe');
    }
    
    return news;
}


//Função para encontrar uma única notícia
export const getNewsById = async (newsId, newsModel, commentModel) => {
    const news = await newsModel.findByPk(newsId, {
        include: [{
            model: commentModel
        }]
    });

    if (!news) {
        throw new Error('Essa notícia não existe');
    }

    return news;
};


//Função para deletar uma notícia
export const deleteNews = async (newsId, userId, newsModel) => {
    const news = await newsModel.findByPk(newsId);

    if (!news) {
        throw new Error('Essa notícia não existe');
    }

    if (news.userId !== userId) {
        throw new Error('Você não pode excluir essa notícia');
    }

    await news.destroy();

    return {
        message: 'Notícia apagada'
    };
};