const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

class CustomWorld {
    async init() {
        // Decisões configuráveis por ambiente:
        // - PLAYWRIGHT_HEADLESS=1 ou CI=true -> executa headless (bom para CI)
        // - PW_STEALTH=1 -> força opções "stealth" mesmo em headless/local
        // - DISABLE_ROUTE_ABORT=1 -> não aborta rotas analytics/tracking
        const headlessEnv = (process.env.PLAYWRIGHT_HEADLESS === '1') || !!process.env.CI;
        const stealth = process.env.PW_STEALTH === '1' || (!headlessEnv && process.env.PW_STEALTH !== '0');

        const launchOptions = { headless: headlessEnv };
        // Se estivermos em modo stealth (local), adicione args para reduzir detecção
        if (stealth) {
            launchOptions.args = [
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars',
                '--window-size=1280,960'
            ];
        } else {
            // em headless/CI, forneça tamanho de janela previsível
            launchOptions.args = ['--window-size=1280,960'];
        }

        this.browser = await chromium.launch(launchOptions);

        // Criar contexto com configurações razoáveis
        this.context = await this.browser.newContext({
            viewport: { width: 1280, height: 960 },
            userAgent: process.env.PW_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false
        });

        // Interceptar requisições de analytics/tracking somente se não desabilitado
        if (!process.env.DISABLE_ROUTE_ABORT) {
            await this.context.route('**/*analytics*', route => route.abort()).catch(() => {});
            await this.context.route('**/*tracking*', route => route.abort()).catch(() => {});
        }

        this.page = await this.context.newPage();

        // Timeouts configuráveis; manter valores longos para evitar flakiness em sites públicos
        const defaultTimeout = parseInt(process.env.PW_DEFAULT_TIMEOUT || '20000', 10);
        this.page.setDefaultTimeout(defaultTimeout);
        this.page.setDefaultNavigationTimeout(defaultTimeout);
    }

    async close() {
        // Aguardar um pouco antes de fechar para evitar fechamento abrupto
        await new Promise(resolve => setTimeout(resolve, 500));
        if (this.browser) await this.browser.close();
    }
}

setWorldConstructor(CustomWorld);
