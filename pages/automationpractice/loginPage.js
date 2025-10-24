const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
    constructor(page) {
        this.page = page;

        this.iptEmail = page.locator('#email');
        this.iptSenha = page.locator('#passwd');
        this.btnLogin = page.locator('#SubmitLogin');
        this.msgErro = page.locator('#center_column .alert.alert-danger');
        this.linkLogout = page.locator('a.logout');
    }

    async navegarParaLogin() {
        await this.page.goto('http://www.automationpractice.pl/index.php?controller=authentication&back=my-account', { waitUntil: 'networkidle' });
        expect(await this.page.title()).toBe('Login - My Shop');
    }

    async preencherLogin(email, senha) {
        await this.iptEmail.fill(email);
        await this.iptSenha.fill(senha);
    }

    async submeterLogin() {
        await this.btnLogin.click();
    }

    async fazerLogin(email, senha) {
        await this.preencherLogin(email, senha);
        await this.submeterLogin();
    }

    async fazerLoginSemCampo(email, senha, campo) {
        await this.preencherLogin(campo === 'email' ? '' : email, campo === 'senha' ? '' : senha);
        await this.submeterLogin();
    }

    async verificarSucessoLogin() {
        await expect(this.linkLogout).toBeVisible();
    }

    async verificarRedirecionamentoMinhaConta() {
        expect(this.page.url()).toBe('http://www.automationpractice.pl/index.php?controller=my-account');
    }  

    async verificarFalhaLogin() {
        const alertaCentralizado = this.page.locator('#center_column .alert.alert-danger');
        if (await alertaCentralizado.count() > 0) {
            await expect(alertaCentralizado.first()).toBeVisible();
            return;
        }
        const alerta = this.page.locator('.alert.alert-danger');
        await expect(alerta.first()).toBeVisible();
    }

    async verificarErroCampoObrigatorio(campo) {
        if (campo === 'email') {
            const alertaErroEmail = this.page.locator('#email_error');
            if (await alertaErroEmail.count() > 0) return await expect(alertaErroEmail).toBeVisible();
            const loginAlert = this.page.locator('#center_column .alert.alert-danger');
            await expect(loginAlert.first()).toBeVisible();
        } else {
            const alertaErroSenha = this.page.locator('#passwd_error');
            if (await alertaErroSenha.count() > 0) return await expect(alertaErroSenha).toBeVisible();
            const alerta = this.page.locator('#center_column .alert.alert-danger');
            await expect(alerta.first()).toBeVisible();
        }
    }
};
