# Projeto de Automação de Testes - Avaliação Outsera

[![CI](https://github.com/galaschi/avaliacao-outsera/actions/workflows/ci.yml/badge.svg)](https://github.com/galaschi/avaliacao-outsera/actions/workflows/ci.yml)

Projeto de automação de testes end-to-end (E2E) e testes de API utilizando **Playwright** e **Cucumber.js**, desenvolvido como parte de uma avaliação técnica.

## 📋 Descrição

Este projeto implementa testes automatizados para validar:
- **Testes de API**: Validação de endpoints REST utilizando Playwright Test com padrão de service layer
- **Testes E2E de Front-end**: Cenários BDD (Behavior-Driven Development) com Cucumber.js e Playwright para automação de interface web

APIs testadas:
- **JSONPlaceholder** (https://jsonplaceholder.typicode.com) - API pública de mock para testes

Aplicações web testadas:
- **Automation Practice** (http://www.automationpractice.pl) - Cenários de login e checkout

---

## ⚙️ CI/CD (GitHub Actions)

Este repositório possui um pipeline de CI configurado em `.github/workflows/ci.yml` que executa automaticamente após cada push e pull request na branch `main`:

- Instala Node 18, dependências (npm ci) e navegadores do Playwright
- Executa os testes de API com Playwright (`tests/api/`) usando os reporters `github` e `html`
- Executa as features BDD do Cucumber (`features/*.feature`) com geração de JSON e um relatório HTML customizado
- Publica os relatórios como artefatos do job

Relatórios gerados no pipeline:
- Playwright HTML: artifact `playwright-report` (abra `index.html`)
- Cucumber HTML customizado: artifact `cucumber-html` (arquivo `test-results/cucumber-html-report.html`)
- Cucumber JSON: artifact `cucumber-json` (arquivos `cucumber-report-*.json`)

Você pode acessar as execuções e baixar os relatórios na aba Actions: https://github.com/galaschi/avaliacao-outsera/actions

📄 **Documentação completa do pipeline**: [docs/CI-CD-PIPELINE.md](docs/CI-CD-PIPELINE.md)
- Arquitetura e configuração detalhada
- Como interpretar os relatórios
- Troubleshooting e métricas

## 🏗️ Arquitetura e Estrutura de Pastas

```
avaliacao/
├── constantes/              # Constantes e dados de teste
│   └── posts.js            # Dados de exemplo para testes de posts
├── features/               # Features BDD (Cucumber)
│   ├── checkout.feature    # Cenários de checkout
│   ├── login.feature       # Cenários de login
│   ├── steps/             # Step definitions (Cucumber)
│   │   ├── checkout.steps.js
│   │   └── login.steps.js
│   └── support/           # Configurações e hooks do Cucumber
│       └── hooks.js       # Hooks (before/after)
├── pages/                 # Page Objects Pattern
│   └── automationpractice/
│       ├── cartPage.js
│       ├── checkoutPage.js
│       ├── loginPage.js
│       └── productPage.js
├── services/              # Service Layer para APIs
│   └── jsonplaceholder.service.js  # Serviço para JSONPlaceholder API
├── tests/                 # Testes Playwright
│   ├── api/              # Testes de API
│   │   └── jsonplaceholder.spec.js
│   ├── front/            # Testes de front-end (se houver testes Playwright puros)
│   └── support/          # Arquivos de suporte
│       └── world.js      # Contexto compartilhado
├── test-results/         # Resultados das execuções (gerado automaticamente)
├── playwright-report/    # Relatórios HTML do Playwright (gerado automaticamente)
├── cucumber-report.html  # Relatório HTML do Cucumber (gerado automaticamente)
├── cucumber-report.json  # Relatório JSON do Cucumber (gerado automaticamente)
├── cucumber.js           # Configuração do Cucumber
├── playwright.config.js  # Configuração do Playwright
├── package.json          # Dependências e scripts npm
└── README.md            # Este arquivo
```

---

## 🔧 Versões Utilizadas

### Node.js
- **Versão recomendada**: Node.js 18.x ou superior
- Verifique sua versão: `node --version`

### Dependências Principais

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| `@playwright/test` | ^1.56.1 | Framework de testes E2E e API |
| `@cucumber/cucumber` | ^8.11.0 | Framework BDD para escrita de cenários em Gherkin |
| `@babel/register` | ^7.22.5 | Transpilador para suporte ES6+ |
| `@types/node` | ^24.8.1 | Tipos TypeScript para Node.js |

---

## 📦 Instalação de Dependências

### 1. Clone o repositório (se aplicável)
```powershell
git clone <url-do-repositorio>
cd avaliacao
```

### 2. Instale as dependências do Node.js
```powershell
npm install
```

### 3. Instale os navegadores do Playwright
```powershell
npx playwright install
```

### 4. Verificar instalação
```powershell
# Verifica a versão do Playwright
npx playwright --version

# Verifica a versão do Cucumber
npx cucumber-js --version
```

---

## 🧪 Como Executar os Testes

### **Testes de API**

Os testes de API validam endpoints REST usando Playwright Test com estrutura Gherkin (Given/When/Then).

#### Executar todos os testes de API
```powershell
npx playwright test tests/api/ --reporter=line
```

#### Executar teste específico (JSONPlaceholder)
```powershell
npx playwright test tests/api/jsonplaceholder.spec.js --reporter=line
```

#### Executar com relatório detalhado
```powershell
npx playwright test tests/api/ --reporter=html
```

#### Executar em modo debug
```powershell
npx playwright test tests/api/jsonplaceholder.spec.js --debug
```

#### Executar apenas testes que falharam anteriormente
```powershell
npx playwright test tests/api/ --last-failed
```

#### Opções úteis
- `--headed`: Executa com navegador visível
- `--project=chromium`: Executa apenas no Chromium
- `--workers=1`: Executa testes sequencialmente (útil para debug)
- `--grep "GET /posts"`: Executa apenas testes com padrão específico no nome

---

### **Testes de Front-end (BDD/Cucumber)**

Os testes E2E utilizam Cucumber.js com sintaxe Gherkin para descrever comportamentos da aplicação web.

#### Executar todas as features
```powershell
npx cucumber-js
```

#### Executar feature específica
```powershell
# Apenas a feature de checkout
npx cucumber-js features/checkout.feature

# Apenas a feature de login
npx cucumber-js features/login.feature
```

#### Executar com tags específicas
```powershell
# Executar apenas cenários com tag @smoke
npx cucumber-js --tags "@smoke"

# Executar todos exceto os com tag @ignore
npx cucumber-js --tags "not @ignore"
```

#### Executar cenário específico por linha
```powershell
npx cucumber-js features/checkout.feature:10
```

#### Executar com relatório HTML customizado
```powershell
npx cucumber-js --format html:cucumber-report.html
```

#### Executar com múltiplos formatos de relatório
```powershell
npx cucumber-js --format progress --format json:cucumber-report.json --format html:cucumber-report.html
```

#### Executar com retry (tentar novamente testes que falharam)
```powershell
npx cucumber-js --retry 1
```

#### Executar em modo dry-run (validar sintaxe sem executar)
```powershell
npx cucumber-js --dry-run
```

---

## 📊 Gerar e Visualizar Relatórios

### Relatórios do Playwright (Testes de API)

#### Gerar relatório HTML
```powershell
npx playwright test tests/api/ --reporter=html
```

#### Visualizar último relatório gerado
```powershell
npx playwright show-report
```

O relatório será aberto automaticamente no navegador padrão. Você pode navegar pelos testes, ver screenshots, traces e logs detalhados.

#### Gerar relatório JSON
```powershell
npx playwright test tests/api/ --reporter=json > test-results.json
```

#### Múltiplos reporters
```powershell
npx playwright test tests/api/ --reporter=html --reporter=json --reporter=line
```

---

### Relatórios do Cucumber (Testes de Front)

#### Gerar relatório HTML
```powershell
npx cucumber-js --format html:cucumber-report.html
```

#### Gerar relatório JSON
```powershell
npx cucumber-js --format json:cucumber-report.json
```

#### Gerar ambos simultaneamente
```powershell
npx cucumber-js --format html:cucumber-report.html --format json:cucumber-report.json
```

#### Abrir relatório HTML gerado
```powershell
# Windows
Start-Process cucumber-report.html

# Ou abrir manualmente o arquivo cucumber-report.html no navegador
```

O arquivo de configuração `cucumber.js` já está configurado para gerar relatórios com timestamp:
- `cucumber-report-<timestamp>.html`
- `cucumber-report-<timestamp>.json`

---

## � Testes de Performance (k6)

Este projeto inclui um script de teste de carga com k6 em `k6/load-test.js`, apontando por padrão para a API pública `https://test-api.k6.io`.

### Instalação do k6 (Windows)

Você pode instalar o k6 usando um destes métodos:

```powershell
# via winget
winget install grafana.k6

# via Chocolatey
choco install k6
```

Verifique a instalação:

```powershell
k6 version
```

### Executar teste de carga (smoke)

Executa um teste leve (padrão: 25 VUs por 30s). Gera relatórios em `test-results/k6-summary.html` e `test-results/k6-summary.json`.

```powershell
npm run perf:k6
```

### Executar teste de carga completo (500 usuários por 5 minutos)

Use flags `-e` para configurar VUs, duração e base URL:

```powershell
k6 run k6/load-test.js -e VUS=500 -e DURATION=5m -e BASE_URL=https://test-api.k6.io
```

Após a execução, abra o relatório HTML:

```powershell
Start-Process test-results/k6-summary.html
```

### Métricas e thresholds aplicados
- http_req_failed: < 1%
- http_req_duration: P95 < 800ms e P99 < 1200ms
- checks (asserts): > 99% passando

---

## �🔍 Scripts NPM Disponíveis

Os seguintes scripts estão configurados no `package.json`:

```powershell
# Executar todos os testes Playwright
npm run test:playwright

# Executar testes Cucumber
npm run test:cucumber

# Executar teste de performance (k6 - smoke)
npm run perf:k6
```

---

## 🌐 APIs e Aplicações Testadas

### JSONPlaceholder API
- **Base URL**: https://jsonplaceholder.typicode.com
- **Endpoints testados**:
	- `GET /posts` - Listar posts
	- `GET /posts/{id}` - Buscar post por ID
	- `GET /posts/{id}/comments` - Buscar comentários de um post
	- `POST /posts` - Criar novo post
	- `PUT /posts/{id}` - Atualizar post completo
	- `PATCH /posts/{id}` - Atualizar post parcialmente
	- `DELETE /posts/{id}` - Deletar post

### Automation Practice (E2E)
- **URL**: http://www.automationpractice.pl
- **Funcionalidades testadas**:
	- Login de usuário
	- Fluxo de checkout (adicionar ao carrinho, finalizar compra)

---

## 📝 Padrões e Boas Práticas Implementadas

### Testes de API
- ✅ **Service Layer Pattern**: Separação clara entre lógica de requisição e asserções
- ✅ **Gherkin Structure**: Uso de `test.step()` para organizar testes em Given/When/Then
- ✅ **Reutilização**: Funções auxiliares reutilizáveis para chamadas HTTP
- ✅ **Validação abrangente**: Status codes, estrutura de resposta, tipos de dados

### Testes E2E
- ✅ **Page Object Model (POM)**: Encapsulamento de elementos e ações de páginas
- ✅ **BDD com Cucumber**: Cenários legíveis em linguagem natural (Gherkin)
- ✅ **Step Definitions**: Separação de steps reutilizáveis
- ✅ **Hooks**: Configuração e limpeza antes/depois dos testes

---

## 🛠️ Troubleshooting

### Erro: "Chromium not found"
```powershell
npx playwright install chromium
```

### Erro: "Module not found"
```powershell
npm install
```

### Testes de API falhando por timeout
- Verifique sua conexão com a internet
- Aumente o timeout no `playwright.config.js`:
```javascript
timeout: 60000 // 60 segundos
```

### Testes E2E falhando
- Verifique se o site http://www.automationpractice.pl está acessível
- Execute com `--headed` para visualizar o que está acontecendo
- Aumente os timeouts se necessário

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação oficial:
	 - [Playwright Docs](https://playwright.dev)
	 - [Cucumber.js Docs](https://cucumber.io/docs/cucumber/)
2. Revise os logs de execução nos relatórios HTML
3. Execute em modo debug para investigar falhas

---

## 📄 Licença

ISC
