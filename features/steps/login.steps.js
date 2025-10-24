const { Given, When, Then } = require('@cucumber/cucumber'); 
const { expect } = require('@playwright/test'); 
const { LoginPage } = require('../../pages/automationpractice/loginPage');

Given('que estou na página de login', async function() {
    this.loginPage = new LoginPage(this.pagina);
    await this.loginPage.navegarParaLogin();
});

Given('que estou logado na loja', async function() {
    this.loginPage = new LoginPage(this.pagina);
    await this.loginPage.navegarParaLogin();
    await this.loginPage.fazerLogin('victorgalaschi@hotmail.com', 'Teste');
    await this.loginPage.verificarSucessoLogin();
});

When('faço login com credenciais válidas', async function() {
    await this.loginPage.fazerLogin('victorgalaschi@hotmail.com', 'Teste');
});

When('faço login com credenciais inválidas', async function() {
    await this.loginPage.fazerLogin('victorgalaschi@hotmail.com', 'SenhaIncorreta');
});

When('tento fazer login sem preencher o {word}', async function(campo) {
    const email = 'victorgalaschi@hotmail.com';
    const senha = 'SenhaIncorreta';

    if (campo === 'email') {
        await this.loginPage.fazerLogin('', senha);
    } else if (campo === 'senha') {
        await this.loginPage.fazerLogin(email, '');
    }
});

Then('devo ser redirecionado para a página da minha conta', async function() {
    await this.loginPage.verificarRedirecionamentoMinhaConta();
});

Then('devo ver o link de logout', async function() {
    await this.loginPage.verificarSucessoLogin();
});

Then('devo ver uma mensagem de erro de login', async function() {
    await this.loginPage.verificarFalhaLogin();
});

Then('devo ver uma mensagem de erro para o campo {word}', async function(campo) {
    await this.loginPage.verificarErroCampoObrigatorio(campo);
});
