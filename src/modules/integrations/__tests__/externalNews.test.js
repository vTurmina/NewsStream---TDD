import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';

import {api, getArticles, getArticleById, searchArticles, getBlogs, getReports } from '../externalNews.service.js';

describe('External News Service - Spaceflight News API', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api);
    });

    afterEach(() => {
        mock.restore();
    });

    
    it('Deve buscar artigos externos com sucesso', async () => {
        mock.onGet('/articles/').reply(200, {
            count: 1,
            results: [{
                id: 1,
                title: 'SpaceX lança novo foguete',
                summary: 'Resumo da notícia',
                url: 'https://example.com/news'

            }]
        });

        const result = await getArticles();

        expect(result.count).toBe(1);
        expect(result.results[0]).toHaveProperty('title', 'SpaceX lança novo foguete');
    });


    it('Deve buscar artigo externo por ID', async () => {
        mock.onGet('/articles/1/').reply(200, {
            id: 1,
            title: 'NASA anuncia nova missão',
            summary: 'Resumo em missão'
        });

        const result = await getArticleById(1);

        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('title', 'NASA anuncia nova missão');
    });


    it('Deve pesquisar artigos externos por termo', async () => {
        mock.onGet('/articles/', {params: { search: 'mars'}})
        .reply(200, {
            count: 1,
            results: [{
                id: 2,
                title: 'Nova descoberta em Marte'
            }]
        });

        const result = await searchArticles('mars');

        expect(result.count).toBe(1);
        expect(result.results[0].title).toContain('Marte');
    });


    it('Deve buscar blogs externos com sucesso', async () => {
        mock.onGet('/blogs/').reply(200, {
            count: 1,
            results: [{
                id: 10,
                title: 'Blog sobre exploração espacial'
            }]
        });

        const result = await getBlogs();

        expect(result.count).toBe(1);
        expect(result.results[0]).toHaveProperty('title');
    });


    it('Deve buscar reports externos com sucesso', async () => {
        mock.onGet('/reports/').reply(200, {
            count: 1,
            results: [{
                id: 20,
                title: 'ISS Daily Report'
            }]
        });

        const result = await getReports();

        expect(result.count).toBe(1);
        expect(result.results[0].title).toBe('ISS Daily Report');
    });
});