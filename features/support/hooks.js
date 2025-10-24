const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const fs = require('fs');

setDefaultTimeout(10 * 1000);

Before(async function() {
    const navegador = await chromium.launch({ 
        headless: false
    });
    const contexto = await navegador.newContext();
    this.pagina = await contexto.newPage();
    this.navegador = navegador;
});

After(async function(scenario) {
    if (this.pagina) {
        const timestamp = Date.now();
        const status = scenario.result.status.toLowerCase();
        const nomeCenario = (scenario.pickle && scenario.pickle.name) 
            ? scenario.pickle.name.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50)
            : 'cenario';
        
        // Screenshot de fim de cenário com nome mais descritivo
        const screenshotPath = `test-results/${nomeCenario}-${status}-${timestamp}.png`;
        await this.pagina.screenshot({ path: screenshotPath });
        
        // Anexar screenshot ao cenário para o reporter customizado
        if (scenario.attach) {
            const fs = require('fs');
            const screenshot = fs.readFileSync(screenshotPath);
            scenario.attach(screenshot, 'image/png');
        }
        
        // Log simples por cenário: nome + status + timestamp ISO + screenshot
        try {
            const iso = new Date().toISOString();
            const linha = JSON.stringify({ 
                scenario: scenario.pickle ? scenario.pickle.name : 'cenario-desconhecido', 
                status: scenario.result.status, 
                timestamp: iso,
                screenshot: screenshotPath
            }) + '\n';
            fs.appendFileSync('test-results/run-log.jsonl', linha, 'utf8');
        } catch (e) {
            console.log('Não foi possível gravar o run-log:', e.message);
        }
        
        // Se falhou, salvar também o HTML da página para debug
        if (scenario.result.status === 'FAILED') {
            try {
                const html = await this.pagina.content();
                require('fs').writeFileSync(`test-results/${nomeCenario}-page-${timestamp}.html`, html);
            } catch (e) {
                console.log('Não foi possível salvar o HTML da página:', e.message);
            }
        }

        // Fechar a página e o navegador
        await this.pagina.close();
        if (this.navegador) {
            await this.navegador.close();
        }
    }
});