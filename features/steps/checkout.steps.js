const { Given, When, Then } = require('@cucumber/cucumber');
const CheckoutPage = require('../../pages/automationpractice/checkoutPage');

Given('ja tenho endereço cadastrado', async function() {
    this.checkoutPage = new CheckoutPage(this.pagina);
    await this.checkoutPage.irParaEndereco();
    await this.checkoutPage.verificarEnderecos();
    await this.checkoutPage.irParaEnvio();
});

Given('aceito os termos de serviço', async function() {
    await this.checkoutPage.aceitarTermosServico();
    await this.checkoutPage.irParaPagamento();
});

Given('seleciono pagamento com cartão de crédito', async function() {
    await this.checkoutPage.selecionarPagamentoCartaoCredito();
    await this.checkoutPage.verificarPagamentoCartaoCreditoSelecionado();
});

When('confirmo o pedido', async function() {
    await this.checkoutPage.confirmarPedido();
});

When('tento confirmar o pedido sem aceitar os termos de serviço', async function() {
    await this.checkoutPage.irParaPagamento();
});

Then('devo ver a mensagem de confirmação do pedido', async function() {
    await this.checkoutPage.verificarConfirmacaoPedido();
});

Then('devo ver uma mensagem de erro sobre os termos de serviço', async function() {
    await this.checkoutPage.verificarErroTermosServico();
});