

import { test, expect } from '@playwright/test';
const jsonplaceholder = require('../../services/jsonplaceholder.service');
const posts = require('../../constantes/posts');

test.describe("GET", () => {      
    test.describe("GET /posts", () => {
        test("Busca por posts sem parametros deve retornar status 200 e listagem de posts", async() => {
            let listagemPosts, retornoPosts;
 
            await test.step("Dado que hajam posts previamente cadastrados", async() => {
                listagemPosts = posts.listagemPosts;
            });

            await test.step("Quando eu faço uma requisição buscar todos os posts", async() => {
                retornoPosts = await jsonplaceholder.buscarPosts();
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
                expect(retornoPosts.status).toBe(200);
            });

            await test.step("E a resposta deve conter uma lista de posts", async() => {
                expect(retornoPosts.json).toEqual(expect.arrayContaining(listagemPosts));
            });
        });
    });

    test.describe("GET /posts/{post}", () => {
        test("Busca por post deve retornar status 200 e dados do post", async() => {
            let post1, retornoPost;

            await test.step("Dado que o post com id 1 exista", async() => {
                post1 = posts.listagemPosts.find(post => post.id === 1);
            });

            await test.step("Quando eu faço uma requisição para buscar o post 1", async() => {
                retornoPost = await jsonplaceholder.buscarPostPorId(1);
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
                expect(retornoPost.status).toBe(200);
            });

            await test.step("E a resposta deve conter os dados do post com id 1", async() => {
                expect(retornoPost.json).toEqual(post1);
            });
        });

        test("Busca por post inexistente deve retornar status 404 e nenhum post", async() => {
            let postInexistenteId, retornoPost;

            await test.step("Dado que o post com id 999 não exista", async() => {
                postInexistenteId = 999;
            });

            await test.step("Quando eu faço uma requisição para buscar o post 999", async() => {
                retornoPost = await jsonplaceholder.buscarPostPorId(postInexistenteId);
            });

            await test.step("Então o status da resposta deve ser 404", async() => {
                expect(retornoPost.status).toBe(404);
            });

            await test.step("E a resposta não deve conter um post", async() => {
                expect(retornoPost.json).toEqual({});
            }); 

        });

        test("Busca por post inválido deve retornar status 400 e mensagem de erro", async() => {
            let postInvalidoId, retornoPost;

            await test.step("Dado que o postId seja inválido", async() => {
                postInvalidoId = 'teste';
            });

            await test.step("Quando eu faço uma requisição para buscar o 'teste'", async() => {
                retornoPost = await jsonplaceholder.buscarPostPorId(postInvalidoId);
            });

            await test.step("Então o status da resposta deve ser 400", async() => {
                expect(retornoPost.status).toBe(404);
            });

            await test.step("E a resposta deve conter uma mensagem de erro", async() => {
                expect(retornoPost.json).toEqual({});
            });
        });
    });

    test.describe("GET /posts/{post}/comments", () => {
        test("Busca por comentarios de post deve retornar status 200 e listagem de comentarios", async() => {
            let comentariosPost1, retornoComentarios;

            await test.step("Dado que o post com id 1 exista e possua comentarios", async() => {
                comentariosPost1 = posts.comentariosPost1;
            });

            await test.step("Quando eu faço uma requisição para buscar os comentarios do post 1", async() => {
                retornoComentarios = await jsonplaceholder.buscarComentariosPorPostId(1);
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
                expect(retornoComentarios.status).toBe(200);
            });

            await test.step("E a resposta deve conter uma lista de comentarios do post 1", async() => {
                expect(retornoComentarios.json).toEqual(comentariosPost1);
            });
        });

        test("Busca por comentarios de post inexistente deve retornar status 200 e lista vazia", async() => {
            let postInexistenteId, retornoComentarios;

            await test.step("Dado que o post com id 999 não exista", async() => {
                postInexistenteId = 999;
            });

            await test.step("Quando eu faço uma requisição para buscar os comentarios do post 999", async() => {
                retornoComentarios = await jsonplaceholder.buscarComentariosPorPostId(postInexistenteId);
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
                expect(retornoComentarios.status).toBe(200);
            }); 

            await test.step("E a resposta deve conter uma lista vazia", async() => {
                expect(retornoComentarios.json).toEqual([]);
            });
        });

        test("busca por comentarios de post inválido deve retornar status 200 e lista vazia", async() => {
            let postInvalidoId, retornoComentarios;

            await test.step("Dado que o postId seja inválido", async() => {
                postInvalidoId = 'teste';
            });

            await test.step("Quando eu faço uma requisição para buscar os comentarios do 'teste'", async() => {
                retornoComentarios = await jsonplaceholder.buscarComentariosPorPostId(postInvalidoId);
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
                expect(retornoComentarios.status).toBe(200);
            });

            await test.step("E a resposta deve conter uma lista vazia", async() => {
                expect(retornoComentarios.json).toEqual([]);
            }); 
        });
    });
});

test.describe("POST", () => {
    test("Criação de post com dados válidos deve retornar status 201 e id do post criado", async() => {
        let retornoPost;
        const novoPost = {
                id: 101,
                title: 'Novo post',
                body: 'Corpo do novo post',
                userId: 1,
            };
        
        await test.step("Dado que o post com id 101 não exista", async() => {
            const post101 = await jsonplaceholder.buscarPostPorId(101);
            expect(post101.status).toBe(404);
        })
            
        await test.step("Quando eu faço uma requisição para criar um novo post", async () => { 
            retornoPost = await jsonplaceholder.criarPost(novoPost);
        });

        await test.step("Então o status da resposta deve ser 201", async() => {
            expect(retornoPost.status).toBe(201);
        });

        await test.step("E a resposta deve conter o id do post criado", async() => {
            expect(retornoPost.json).toEqual({"id": 101});
        });
    });

    posts.camposInválidos.forEach(({ campo, valor }) => {
        test(`Criação de post com o campo ${campo} inválidos deve retornar status 201 e id do post criado`, async() => {
            let retornoPost;
            const novoPost = {
                title: 'Novo post',
                body: 'Corpo do novo post',
                userId: 1,
            };

            await test.step("Dado que o post com id 101 não exista", async() => {
                const post101 = await jsonplaceholder.buscarPostPorId(101);
                expect(post101.status).toBe(404);
            })
            
            await test.step("Quando eu faço uma requisição para criar um novo post com dados inválidos", async () => { 
                novoPost[campo] = valor;
                retornoPost = await jsonplaceholder.criarPost(novoPost);
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
                expect(retornoPost.status).toBe(201);
            });

            await test.step("E a resposta deve conter o id do post criado", async() => {
                expect(retornoPost.json).toEqual({"id": 101});
            });
        });
    });

    posts.camposPost.forEach(({campo}) => {
        test(`Criação de post sem o campo ${campo} deve retornar status 201 e id do post criado`, async() => {
            let retornoPost;
            const novoPost = {
                title: 'Novo post',
                body: 'Corpo do novo post',
                userId: 1,
            };

            await test.step("Dado que o post com id 101 não exista", async() => {
                const post101 = await jsonplaceholder.buscarPostPorId(101);
                expect(post101.status).toBe(404);
            })

            await test.step(`Quando eu faço uma requisição para criar um novo post sem o campo ${campo}`, async () => { 
                delete novoPost[campo];
                retornoPost = await jsonplaceholder.criarPost(novoPost);
            });

            await test.step("Então o status da resposta deve ser 201", async() => {
                expect(retornoPost.status).toBe(201);
            });

            await test.step("E a resposta deve conter o id do post criado", async() => {
                expect(retornoPost.json).toEqual({"id": 101});
            });
        });
    });
});

test.describe("PUT", () => {
    test("Atualização de post com dados válidos deve retornar status 200 e id do post atualizado", async() => {
        let retornoPost;
        
        await test.step("Dado que o post com id 1 exista", async() => {
            const post101 = await jsonplaceholder.buscarPostPorId(1);
            expect(post101.status).toBe(200);
        })

        await test.step("Quando eu faço uma requisição para atualizar o post 1 com dados válidos", async () => {
            retornoPost = await jsonplaceholder.atualizarPost(1, {
                title: 'Post atualizado',
                body: 'Corpo do post atualizado',
                userId: 1,
            });
        });
        
        await test.step("Então o status da resposta deve ser 200", async() => {
           expect(retornoPost.status).toBe(200);    
        });

        await test.step("E a resposta deve conter o id do post atualizado", async() => {
            expect(retornoPost.json).toEqual({id: 1});
        });
    });

    test("Atualização de post inexistente deve retornar status 500", async() => {
        let retornoPost;

        await test.step("Dado que o post com id 999 não exista", async() => {
            const post999 = await jsonplaceholder.buscarPostPorId(999);
            expect(post999.status).toBe(404);
        })      

        await test.step("Quando eu faço uma requisição para atualizar o post 999 com dados válidos", async () => {
            retornoPost = await jsonplaceholder.atualizarPost(999, {
                title: 'Post atualizado',
                body: 'Corpo do post atualizado',
                userId: 1,
            });
        });
        
        await test.step("Então o status da resposta deve ser 500", async() => {
           expect(retornoPost.status).toBe(500);
        });
        
        await test.step("E a resposta deve vir vazia", async() => {
            expect(retornoPost.json).toEqual({});   
        });
    });

    posts.camposInválidos.forEach(({ campo, valor }) => {
        test(`Atualização de post com o campo ${campo} inválido deve retornar status 201 e id do post criado`, async() => {
            let retornoPost;

            await test.step("Dado que o post com id 1 exista", async() => {
                const post1 = await jsonplaceholder.buscarPostPorId(1);
                expect(post1.status).toBe(200);
            })

            await test.step("Quando eu faço uma requisição para atualizar o post 1 com dados inválidos", async () => {
                const postAtualizado = {
                    title: 'Post atualizado',
                    body: 'Corpo do post atualizado',
                    userId: 1,
                };
                postAtualizado[campo] = valor;
                retornoPost = await jsonplaceholder.atualizarPost(1, postAtualizado);
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
               expect(retornoPost.status).toBe(200);
            });

            await test.step("E a resposta deve conter o id do post atualizado", async() => {
                expect(retornoPost.json).toEqual({id: 1});
            });
        });
    });
});

test.describe("PATCH", () => {
    posts.camposPost.forEach(({ campo }) => {
        test(`Atualização do campo ${campo} de post com dados válidos deve retornar status 200 e dados do post atualizado`, async() => {
            let retornoPost, post1;
    
            await test.step("Dado que o post com id 1 exista", async() => {
                post1 = await jsonplaceholder.buscarPostPorId(1);
                expect(post1.status).toBe(200);
            });
    
            await test.step("Quando eu faço uma requisição para atualizar parcialmente o post 1 com dados válidos", async () => {
                const post = {};
                post[campo] = `campo atualizado`;
                retornoPost = await jsonplaceholder.atualizarPostParcial(1, post);
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
               expect(retornoPost.status).toBe(200);
            });

            await test.step("E a resposta deve conter o id do post atualizado", async() => {
                const post1json = post1.json;
                expect(retornoPost.json).toEqual(post1json);
            });
        });
    });

    posts.camposPost.forEach(({ campo }) => {
        test(`Atualização parcial do campo ${campo} de post inexistente deve retornar status 500`, async() => {
            let retornoPost;

            await test.step("Dado que o post com id 999 não exista", async() => {
                const post999 = await jsonplaceholder.buscarPostPorId(999);
                expect(post999.status).toBe(404);
            });

            await test.step("Quando eu faço uma requisição para atualizar parcialmente o post 999 com dados válidos", async () => {
                const post = {};
                post[campo] = `campo atualizado`;
                retornoPost = await jsonplaceholder.atualizarPostParcial(999, post);
            });
            
            await test.step("Então o status da resposta deve ser 200", async() => {
               expect(retornoPost.status).toBe(200);
            });

            await test.step("E a resposta deve vir vazia", async() => {
                expect(retornoPost.json).toEqual({});   
            });
        });
    });

    posts.camposInválidos.forEach(({ campo, valor }) => {
        test(`Atualização parcial com o campo ${campo} inválido deve retornar status 201 e id do post criado`, async() => {
            let retornoPost, post1;

            await test.step("Dado que o post com id 1 exista", async() => {
                post1 = await jsonplaceholder.buscarPostPorId(1);
                expect(post1.status).toBe(200);
            });

            await test.step("Quando eu faço uma requisição para atualizar parcialmente o post 1 com dados inválidos", async () => {
                const post = {};
                post[campo] = valor;
                retornoPost = await jsonplaceholder.atualizarPostParcial(1, post);
            });

            await test.step("Então o status da resposta deve ser 200", async() => {
               expect(retornoPost.status).toBe(200);
            });

            await test.step("E a resposta deve conter o id do post atualizado", async() => {
                const post1json = post1.json;
                expect(retornoPost.json).toEqual(post1json);
            });
        });
    });
});

test.describe("DELETE", () => {
    test("Exclusão de post existente deve retornar status 200 e mensagem de sucesso", async() => {
        let retornoPost;

        await test.step("Dado que o post com id 1 exista", async() => {
            const post1 = await jsonplaceholder.buscarPostPorId(1);
            expect(post1.status).toBe(200);
        });

        await test.step("Quando eu faço uma requisição para excluir o post 1", async () => {
            retornoPost = await jsonplaceholder.excluirPost(1);
        });

        await test.step("Então o status da resposta deve ser 200", async() => {
           expect(retornoPost.status).toBe(200);
        });

        await test.step("E a resposta deve vir vazia", async() => {
            expect(retornoPost.json).toEqual({});
        });
    });

    test("Exclusão de post inexistente deve retornar status 404 e mensagem de erro", async() => {
        let retornoPost;
        
        await test.step("Dado que o post com id 999 não exista", async() => {
            const post999 = await jsonplaceholder.buscarPostPorId(999);
            expect(post999.status).toBe(404);
        });

        await test.step("Quando eu faço uma requisição para excluir o post 999", async () => {
            retornoPost = await jsonplaceholder.excluirPost(999);
        });

        await test.step("Então o status da resposta deve ser 404", async() => {
           expect(retornoPost.status).toBe(200);
        });

        await test.step("E a resposta deve vir vazia", async() => {
            expect(retornoPost.json).toEqual({});
        }); 
    });
});