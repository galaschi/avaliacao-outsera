const { Given, When, Then } = require('@cucumber/cucumber');
const ProdutoPage = require('../../pages/automationpractice/produtoPage');

Given('acesso o produto {string}', async function(nomeProduto) {
    this.produtoPage = new ProdutoPage(this.pagina);
    await this.produtoPage.navegarParaProduto(nomeProduto);
});

Given('adiciono o produto ao carrinho', async function() {
    await this.produtoPage.adicionarAoCarrinho();
    await this.produtoPage.irParaCheckout();
});

Given('prossigo para o checkout', async function() {
    await this.produtoPage.irParaCheckout();
});

Given('altero a quantidade para um valor maior que o estoque disponível', async function() {
    const quantidadeEstoque = await this.produtoPage.obterQuantidadeEstoque();
    await this.produtoPage.alterarQuantidade(quantidadeEstoque + 1);
});

When('tento adicionar o produto ao carrinho', async function() {
    await this.produtoPage.adicionarAoCarrinho();
});

Then('devo ver uma mensagem de erro sobre estoque insuficiente', async function() {
    await this.produtoPage.verificarErroQuantidadeIndisponivel();
});
