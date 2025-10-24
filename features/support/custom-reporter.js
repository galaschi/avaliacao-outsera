const { Formatter } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

class CustomHTMLReporter extends Formatter {
    constructor(options) {
        super(options);

        this.scenarios = [];
        this.startTime = Date.now();

        options.eventBroadcaster.on('envelope', (envelope) => {
            if (envelope.testRunFinished) {
                this.handleTestRunFinished();
            }
        });
    }

    handleTestRunFinished() {
        // Aguarda um pouco para o arquivo JSON ser escrito completamente
        setTimeout(() => {
            this.generateHTMLReport();
        }, 1000);
    }

    generateHTMLReport() {
        const endTime = Date.now();
        const totalDuration = endTime - this.startTime;

        // Lê o arquivo JSON gerado pelo Cucumber para ter todos os dados
        const jsonFiles = fs.readdirSync(process.cwd()).filter(f => f.startsWith('cucumber-report-') && f.endsWith('.json'));
        if (jsonFiles.length === 0) {
            console.log('⚠️  Nenhum arquivo cucumber-report-*.json encontrado para gerar o HTML');
            return;
        }

        const latestJsonFile = jsonFiles.sort().reverse()[0];
    console.log(`📄 Lendo JSON: ${latestJsonFile}`);
        const jsonPath = path.join(process.cwd(), latestJsonFile);
        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        
        if (!jsonContent || jsonContent.trim() === '') {
            console.log('⚠️  Arquivo JSON vazio');
            return;
        }
        
        let cucumberJson;
        try {
            cucumberJson = JSON.parse(jsonContent);
            console.log(`✅ JSON parseado com sucesso. Features: ${cucumberJson.length}`);
        } catch (e) {
            console.log('⚠️  Erro ao ler JSON:', e.message);
            console.log('Conteúdo (primeiros 100 chars):', jsonContent.substring(0, 100));
            return;
        }

        const scenarios = [];
        let totalScenarios = 0;
        let passedScenarios = 0;
        let failedScenarios = 0;

        // Carrega run-log.jsonl (se existir) para mapear screenshots por cenário
        const runLogPath = path.join(process.cwd(), 'test-results', 'run-log.jsonl');
        let runLogEntries = [];
        if (fs.existsSync(runLogPath)) {
            try {
                const logContent = fs.readFileSync(runLogPath, 'utf8');
                runLogEntries = logContent
                    .split(/\r?\n/)
                    .filter(line => line.trim())
                    .map(line => {
                        try { return JSON.parse(line); } catch { return null; }
                    })
                    .filter(Boolean);
            } catch (e) {
                console.log('⚠️  Não foi possível ler run-log.jsonl:', e.message);
            }
        }

        cucumberJson.forEach(feature => {
            feature.elements.forEach(scenario => {
                totalScenarios++;
                const steps = scenario.steps.map(step => ({
                    keyword: step.keyword,
                    name: step.name,
                    status: step.result.status,
                    duration: step.result.duration ? (step.result.duration / 1000000).toFixed(0) : 0,
                    errorMessage: step.result.error_message || null
                }));

                const scenarioStatus = steps.some(s => s.status === 'failed') ? 'failed' : 
                                     steps.every(s => s.status === 'passed') ? 'passed' : 'undefined';

                if (scenarioStatus === 'passed') passedScenarios++;
                if (scenarioStatus === 'failed') failedScenarios++;

                const scenarioDuration = steps.reduce((sum, s) => sum + parseInt(s.duration || 0), 0);

                // Busca screenshots salvos (prioriza run-log.jsonl)
                let screenshots = [];
                try {
                    // 1) Tenta via run-log.jsonl
                    const matchingLogs = runLogEntries.filter(e => e.scenario === scenario.name && e.screenshot);
                    if (matchingLogs.length > 0) {
                        screenshots = matchingLogs.map(e => {
                            try {
                                const imgData = fs.readFileSync(path.join(process.cwd(), e.screenshot)).toString('base64');
                                return `data:image/png;base64,${imgData}`;
                            } catch { return null; }
                        }).filter(Boolean);
                    }

                    // 2) Fallback: procura por padrão de nome de arquivo
                    if (screenshots.length === 0) {
                        const nomeCenario = scenario.name.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50);
                        const screenshotPattern = new RegExp(`${nomeCenario}-(passed|failed)-\\d+\\.png`);
                        const files = fs.readdirSync('test-results').filter(f => screenshotPattern.test(f));
                        screenshots = files.map(f => {
                            const imgPath = path.join('test-results', f);
                            const imgData = fs.readFileSync(imgPath).toString('base64');
                            return `data:image/png;base64,${imgData}`;
                        });
                    }
                } catch (e) {
                    console.log('⚠️  Erro ao carregar evidências:', e.message);
                }

                scenarios.push({
                    name: scenario.name,
                    status: scenarioStatus,
                    steps: steps,
                    duration: scenarioDuration,
                    screenshots: screenshots
                });
            });
        });

        const html = this.buildHTML({
            totalScenarios,
            passedScenarios,
            failedScenarios,
            totalDuration,
            timestamp: new Date().toISOString(),
            scenarios: scenarios
        });

        const reportPath = path.join(process.cwd(), 'test-results', 'cucumber-html-report.html');
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        fs.writeFileSync(reportPath, html, 'utf8');
        console.log(`\n📊 Relatório HTML gerado: ${reportPath}`);
    }

    buildHTML(data) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Testes - Cucumber</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }
        
        .summary-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .summary-card h3 {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .summary-card .value {
            font-size: 36px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .summary-card.passed .value {
            color: #28a745;
        }
        
        .summary-card.failed .value {
            color: #dc3545;
        }
        
        .summary-card.duration .value {
            color: #667eea;
            font-size: 24px;
        }
        
        .scenarios {
            padding: 40px;
        }
        
        .scenario {
            background: white;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .scenario-header {
            padding: 20px;
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .scenario-header.passed {
            border-left-color: #28a745;
        }
        
        .scenario-header.failed {
            border-left-color: #dc3545;
        }
        
        .scenario-name {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            flex: 1;
        }
        
        .scenario-status {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-left: 16px;
        }
        
        .scenario-status.passed {
            background: #d4edda;
            color: #155724;
        }
        
        .scenario-status.failed {
            background: #f8d7da;
            color: #721c24;
        }
        
        .scenario-duration {
            font-size: 14px;
            color: #6c757d;
            margin-left: 16px;
        }
        
        .steps {
            padding: 0;
        }
        
        .step {
            padding: 16px 20px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .step:last-child {
            border-bottom: none;
        }
        
        .step-icon {
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .step-content {
            flex: 1;
        }
        
        .step-keyword {
            font-weight: 600;
            color: #667eea;
            margin-right: 8px;
        }
        
        .step-text {
            color: #2c3e50;
        }
        
        .step-duration {
            font-size: 12px;
            color: #6c757d;
            margin-top: 4px;
        }
        
        .step-error {
            background: #f8d7da;
            color: #721c24;
            padding: 12px;
            border-radius: 4px;
            margin-top: 8px;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
        }
        
        .attachments {
            padding: 20px;
            background: #f8f9fa;
        }
        
        .attachments h4 {
            margin-bottom: 12px;
            color: #2c3e50;
        }
        
        .screenshot {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Relatório de Testes</h1>
            <p>Gerado em: ${new Date(data.timestamp).toLocaleString('pt-BR')}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total de Cenários</h3>
                <div class="value">${data.totalScenarios}</div>
            </div>
            <div class="summary-card passed">
                <h3>Aprovados</h3>
                <div class="value">${data.passedScenarios}</div>
            </div>
            <div class="summary-card failed">
                <h3>Reprovados</h3>
                <div class="value">${data.failedScenarios}</div>
            </div>
            <div class="summary-card duration">
                <h3>Duração Total</h3>
                <div class="value">${(data.totalDuration / 1000).toFixed(2)}s</div>
            </div>
        </div>
        
        <div class="scenarios">
            ${data.scenarios.map(scenario => this.buildScenarioHTML(scenario)).join('')}
        </div>
    </div>
</body>
</html>`;
    }

    buildScenarioHTML(scenario) {
        const statusIcon = scenario.status === 'passed' ? '✅' : '❌';
        
        return `
        <div class="scenario">
            <div class="scenario-header ${scenario.status}">
                <div class="scenario-name">${this.escapeHtml(scenario.name)}</div>
                <span class="scenario-status ${scenario.status}">${statusIcon} ${scenario.status}</span>
                <span class="scenario-duration">⏱️ ${(scenario.duration / 1000).toFixed(2)}s</span>
            </div>
            <div class="steps">
                ${scenario.steps.map(step => this.buildStepHTML(step, statusIcon)).join('')}
            </div>
            ${scenario.screenshots.length > 0 ? this.buildAttachmentsHTML(scenario.screenshots) : ''}
        </div>
        `;
    }

    buildStepHTML(step, statusIcon) {
        const icon = step.status === 'passed' ? '✅' : 
                    step.status === 'failed' ? '❌' : 
                    step.status === 'skipped' ? '⊝' : '○';
        
        return `
        <div class="step">
            <span class="step-icon">${icon}</span>
            <div class="step-content">
                <div>
                    <span class="step-keyword">${this.escapeHtml(step.keyword)}</span>
                    <span class="step-text">${this.escapeHtml(step.name)}</span>
                </div>
                <div class="step-duration">⏱️ ${step.duration}ms</div>
                ${step.errorMessage ? `<div class="step-error">${this.escapeHtml(step.errorMessage)}</div>` : ''}
            </div>
        </div>
        `;
    }

    buildAttachmentsHTML(screenshots) {
        return `
        <div class="attachments">
            <h4>📸 Evidências</h4>
            ${screenshots.map(screenshot => `<img src="${screenshot}" alt="Screenshot" class="screenshot" />`).join('')}
        </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

module.exports = CustomHTMLReporter;
