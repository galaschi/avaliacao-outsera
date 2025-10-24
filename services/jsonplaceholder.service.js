const { request } = require('@playwright/test');

const API_BASE = 'https://jsonplaceholder.typicode.com';

async function requisicao(metodo, endpoint, dados = {}) {
    const headers = { 'content-type': 'application/json' };
    const apiContext = await request.newContext({ extraHTTPHeaders: headers });

    let retorno;
    try {
        retorno = await apiContext[metodo](`${API_BASE}${endpoint}`, dados);
        const json = await retorno.json();
        return { status: retorno.status(), json };
    } catch (erro) {
        return { status: retorno.status(), json: {} };
    } finally {
        await apiContext.dispose();
    }
}

module.exports = { 
    buscarPosts: () => requisicao('get', '/posts'),
    buscarPostPorId: (postId) => requisicao('get', `/posts/${postId}`),
    buscarComentariosPorPostId: (postId) => requisicao('get', `/posts/${postId}/comments`),
    criarPost: (post) => requisicao('post', '/posts', post),
    atualizarPost: (postId, post) => requisicao('put', `/posts/${postId}`, post),
    atualizarPostParcial: (postId, post) => requisicao('patch', `/posts/${postId}`, post),
    excluirPost: (postId) => requisicao('delete', `/posts/${postId}`),
};

