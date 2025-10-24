const { expect } = require('@playwright/test');

class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.txtEnderecoEntrega = page.locator('#address_delivery .address_firstname, #address_delivery .address_lastname');
        this.txtEnderecoCobranca = page.locator('#address_invoice .address_firstname, #address_invoice .address_lastname');
        this.btnProceedToCheckout = page.locator('.cart_navigation a[title="Proceed to checkout"]');
        this.checkboxTermosServico = page.locator('#cgv');
        this.botaoProcessAddress = page.locator('button[name="processAddress"]');
        this.botaoProcessCarrier = page.locator('button[name="processCarrier"]');
        this.linkPagamentoCartaoCredito = page.locator('.payment_module a.bankwire');
        this.txtPagamentoSelecionado = page.locator('p.cheque-indent strong');
        this.btnConfirmarPedido = page.locator('#cart_navigation button[type="submit"]');
        this.txtMensagemConfirmacao = page.locator('p.alert.alert-success');
        this.alertaErroTermosServico = page.locator('.fancybox-error');
    }

    async verificarEnderecoEntrega() {
        await this.txtEnderecoEntrega.waitFor({ state: 'visible' });
        const enderecoAtual = await this.txtEnderecoEntrega.textContent();
        expect(enderecoAtual.trim().length).toBeGreaterThan(0);
    }

    async verificarEnderecoCobranca() {
        await this.txtEnderecoCobranca.waitFor({ state: 'visible' });
        const enderecoAtual = await this.txtEnderecoCobranca.textContent();
        expect(enderecoAtual.trim().length).toBeGreaterThan(0); 
    }

    async verificarEnderecos(){
        await this.verificarEnderecoEntrega();
        await this.verificarEnderecoCobranca();
    }

    async irParaEndereco() {
        const jaNaEtapaEndereco = await this.txtEnderecoEntrega.count().then(c => c > 0).catch(() => false);
        if (jaNaEtapaEndereco) return;

        try {
            await this.btnProceedToCheckout.first().waitFor({ state: 'visible', timeout: 4000 });
            await Promise.all([
                this.page.waitForLoadState('networkidle'),
                this.btnProceedToCheckout.first().click()
            ]);
        } catch (_) {
            await this.page.goto('http://www.automationpractice.pl/index.php?controller=order&step=1', { waitUntil: 'networkidle' });
        }
    }

    async aceitarTermosServico() {
        await this.checkboxTermosServico.waitFor({ state: 'visible' });
        if (!(await this.checkboxTermosServico.isChecked())) {
            await this.checkboxTermosServico.check();
        }
    }

    async irParaEnvio() {
        await this.botaoProcessAddress.first().waitFor({ state: 'visible' });
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            this.botaoProcessAddress.first().click()
        ]);
    }

    async irParaPagamento() {
        await this.botaoProcessCarrier.first().waitFor({ state: 'visible' });
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            this.botaoProcessCarrier.first().click()
        ]);
    }

    async selecionarPagamentoCartaoCredito() {
        await this.linkPagamentoCartaoCredito.click();
    }   

    async verificarPagamentoCartaoCreditoSelecionado() {
        await expect(this.txtPagamentoSelecionado).toHaveText('You have chosen to pay by bank wire. Here is a short summary of your order:');
    }

    async confirmarPedido() {
        await this.btnConfirmarPedido.click();
    }

    async verificarConfirmacaoPedido() {
        await expect(this.txtMensagemConfirmacao).toBeVisible();
        await expect(this.txtMensagemConfirmacao).toHaveText('Your order on My Shop is complete.');
    }

    async verificarErroTermosServico() {
        await expect(this.alertaErroTermosServico).toBeVisible();
        await expect(this.alertaErroTermosServico).toContainText('You must agree to the terms of service before continuing.');
    }
}

module.exports = CheckoutPage;