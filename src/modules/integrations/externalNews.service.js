import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.spaceflightnewsapi.net/v4'
});

export async function getArticles() {
    const response = await api.get('/articles/');
    return response.data;
}

export async function getArticleById(id) {
    const response = await api.get(`/articles/${id}/`);
    return response.data;
}

export async function searchArticles(term) {
    const response = await api.get('/articles/', {
        params: {
            search: term
        }
    });

    return response.data;
}

export async function getBlogs() { 
    const response = await api.get('/blogs/');
    return response.data;
}

export async function getReports() {
    const response = await api.get('/reports/');
    return response.data;
}

export { api };