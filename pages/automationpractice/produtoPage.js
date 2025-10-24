const { expect } = require('@playwright/test');

class ProdutoPage {
    constructor(page) {
        this.page = page;

        this.btnAddToCart = '#add_to_cart button';
        this.btnProceedToCheckout = 'a[title="Proceed to checkout"]';
        this.txtQuantidadeEstoque = '#quantityAvailable';
        this.txtErroQuantidadeIndisponivel = '.fancybox-error';
    }

    async navegarParaProduto(nomeProduto) {
        if (nomeProduto.toLowerCase().includes('printed summer dress')) {
            const urlProduto = 'http://www.automationpractice.pl/index.php?id_product=5&controller=product#/13-color-orange/3-size-l';
            await this.page.goto(urlProduto, { waitUntil: 'networkidle' });
        }
    };

    async adicionarAoCarrinho() {
        await this.page.waitForSelector(this.btnAddToCart, { state: 'visible' });
        await this.page.click(this.btnAddToCart);
    }

    async irParaCheckout() {
        await this.page.waitForSelector(this.btnProceedToCheckout, { state: 'visible' });
    }

    async obterQuantidadeEstoque()  {
        await this.page.waitForSelector(this.txtQuantidadeEstoque, { state: 'visible' });
        const quantidadeTexto = await this.page.textContent(this.txtQuantidadeEstoque);
        const quantidadeNumero = parseInt(quantidadeTexto);
        return quantidadeNumero;
    }

    async alterarQuantidade(novaQuantidade) {
        await this.page.fill('input#quantity_wanted', novaQuantidade.toString());
    }

    async verificarErroQuantidadeIndisponivel() {
        const alertaErro = this.page.locator(this.txtErroQuantidadeIndisponivel);
        await expect(alertaErro).toBeVisible();
        const textoAlerta = await alertaErro.textContent();
        expect(textoAlerta).toContain("There isn't enough product in stock.");
    }

};

module.exports = ProdutoPage;