//like e unlike
export const toggleLike = async ( newsId, userId, likeModel) => {
    const existingLike = await likeModel.findOne({
        where: {
            newsId,
            userId
        }
    });

    if (existingLike) {
        await existingLike.destroy();

        return {
            message: 'Curtida removida'
        };
    }

    const like = await likeModel.create({
        newsId,
        userId
    });

    return {
        message: 'Curtida realizada', like
    };
};

//postar comentários
export const commentNews = async (content, newsId, userId, commentModel) => {
    if(!content || content.trim() === ''){
        throw new Error("Comentário inválido");
    }
    
    const comment = await commentModel.create({content, newsId, userId});

    return { 
        message: 'Você compartilhou sua opinião nesse post', comment
    };
};


//excluir comentários
export const deleteComment = async (commentId, userId, commentModel) => {
    const comment = await commentModel.findByPk(commentId);

    if (!comment) {
        throw new Error('Comentário não encontrado');
    }

    if (comment.userId !== userId){
        throw new Error('Você não pode excluir esse comentário');
    }

    await comment.destroy();

    return{
        message: 'Comentário excluído'
    };
};