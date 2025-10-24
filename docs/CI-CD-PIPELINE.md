# Pipeline CI/CD - Relatório Detalhado

## 📋 Visão Geral

Este documento descreve o pipeline de Integração Contínua (CI) configurado para o projeto **Avaliação Outsera**, detalhando sua arquitetura, execução e resultados.

---

## ⚙️ Configuração do Pipeline

### Arquivo de Configuração
- **Localização**: `.github/workflows/ci.yml`
- **Plataforma**: GitHub Actions
- **Runner**: `ubuntu-latest`

### Gatilhos (Triggers)
O pipeline é executado automaticamente nos seguintes eventos:
- **Push** para a branch `main`
- **Pull Request** aberto ou atualizado para a branch `main`

### Controle de Concorrência
```yaml
concurrency:
  group: avaliacao-outsera-${{ github.ref }}
  cancel-in-progress: true
```
- Apenas uma execução por branch/PR por vez
- Novas execuções cancelam as anteriores em andamento

---

## 🔄 Etapas do Pipeline

### 1. Checkout do Código
```yaml
- uses: actions/checkout@v4
```
- Clona o repositório na versão do commit que disparou o workflow

### 2. Setup do Node.js
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 18
    cache: npm
```
- Instala Node.js versão 18 (LTS)
- Utiliza cache do npm para acelerar instalação de dependências

### 3. Instalação de Dependências
```bash
npm ci
```
- Instalação limpa baseada no `package-lock.json`
- Garante reprodutibilidade das versões instaladas
- Mais rápido e confiável que `npm install` em CI

### 4. Instalação dos Navegadores Playwright
```bash
npx playwright install --with-deps
```
- Baixa binários dos navegadores (Chromium, Firefox, WebKit)
- Instala dependências de sistema necessárias (--with-deps)
- Navegadores são cacheados entre execuções quando possível

### 5. Execução dos Testes de API (Playwright)
```bash
npx playwright test tests/api/ --reporter=github,html
```
- **Escopo**: Todos os specs em `tests/api/`
- **Reporters**:
  - `github`: Integrado com a UI do GitHub Actions (annotations, grupos)
  - `html`: Relatório HTML interativo salvo em `playwright-report/`
- **Duração típica**: ~10-30 segundos

**Cobertura dos testes de API**:
- GET /posts - Listar todos os posts
- GET /posts/{id} - Buscar post por ID
- GET /posts/{id}/comments - Buscar comentários de um post
- POST /posts - Criar novo post
- PUT /posts/{id} - Atualizar post completo
- PATCH /posts/{id} - Atualizar post parcialmente
- DELETE /posts/{id} - Deletar post

### 6. Upload do Relatório Playwright
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report
```
- Publica o relatório HTML como artifact do job
- Disponível para download por 90 dias (padrão do GitHub)
- Contém traces, screenshots e logs detalhados

### 7. Execução dos Testes E2E (Cucumber)
```bash
npx cucumber-js
```
- **Escopo**: Todas as features em `features/*.feature`
- **Configuração**: `cucumber.js` (formatters, parallel, retry)
- **continue-on-error: true**: Permite que falhas de cenário não bloqueiem o pipeline
- **Duração típica**: ~2-5 minutos (dependendo do número de cenários)

**Features testadas**:
- Login (3 cenários)
  - Login com sucesso
  - Login com senha incorreta
  - Campos obrigatórios não preenchidos (esquema de cenário)
- Checkout (3 cenários)
  - Compra bem-sucedida
  - Tentativa sem aceitar termos
  - Produto esgotado

### 8. Upload dos Relatórios Cucumber
Três artifacts são gerados:

**cucumber-json**:
```yaml
path: cucumber-report-*.json
```
- Arquivo(s) JSON com resultados estruturados
- Útil para processamento ou integração com dashboards

**cucumber-html**:
```yaml
path: test-results/cucumber-html-report.html
```
- Relatório HTML customizado gerado por `features/support/custom-reporter.js`
- Inclui screenshots, duração de steps, status detalhado

### 9. Job Summary
```bash
echo "## ✅ CI executado" >> $GITHUB_STEP_SUMMARY
```
- Gera um resumo visual na interface do GitHub Actions
- Inclui:
  - Branch e commit SHA
  - Aviso se Cucumber teve falhas
  - Links para artifacts

---

## 📊 Resultados e Relatórios

### Como Acessar os Relatórios

1. **Acesse a aba Actions no repositório**:
   ```
   https://github.com/galaschi/avaliacao-outsera/actions
   ```

2. **Selecione a execução desejada** (workflow run)

3. **Role até a seção "Artifacts"** (no final da página)

4. **Baixe os artifacts**:
   - `playwright-report` (ZIP contendo HTML report)
   - `cucumber-html` (ZIP com o relatório customizado)
   - `cucumber-json` (ZIP com JSONs timestamped)

5. **Descompacte e abra**:
   - Playwright: abra `playwright-report/index.html`
   - Cucumber: abra `test-results/cucumber-html-report.html`

### Interpretando o Relatório Playwright

**Estrutura do Relatório HTML**:
- **Overview**: Total de testes, passes, falhas, skipped, flaky
- **Filtros**: Por status, projeto (browser), arquivo
- **Timeline**: Visualização temporal das execuções
- **Detalhes por teste**:
  - Duração
  - Retries (se houver)
  - Logs de console
  - Network requests
  - Screenshots (em caso de falha)
  - Traces interativos (quando habilitados)

**Exemplo de interpretação**:
```
✅ 7 passed (18.5s)
```
- Todos os 7 testes de API passaram
- Tempo total: 18.5 segundos
- Nenhum retry foi necessário

### Interpretando o Relatório Cucumber

**Estrutura do Relatório HTML Customizado**:
- **Summary Cards**:
  - Total de Cenários
  - Aprovados (verde)
  - Reprovados (vermelho)
  - Duração Total

- **Cenários Detalhados**:
  - Nome do cenário
  - Status (✅ passed / ❌ failed)
  - Duração
  - Steps individuais com:
    - Keyword (Dado, Quando, Então)
    - Texto do step
    - Duração em ms
    - Mensagem de erro (se falhou)
  - Screenshots (quando disponíveis)

**Exemplo de interpretação**:
```
Total: 6 cenários
Aprovados: 4
Reprovados: 2
Duração: 142.34s
```

**Possíveis causas de falha**:
- Step não implementado (undefined)
- Timeout ao aguardar elemento
- Asserção falhada (expect)
- Site de teste indisponível (http://www.automationpractice.pl)

---

## 🔍 Troubleshooting

### Pipeline Falha na Instalação de Dependências
**Sintoma**: `npm ci` falha com erro de rede ou versão

**Solução**:
- Verifique se `package-lock.json` está commitado
- Confirme compatibilidade das versões no `package.json`
- Limpe o cache: adicione step `npm cache clean --force` antes do `npm ci`

### Playwright: "Chromium not found"
**Sintoma**: Testes falham com erro "Executable doesn't exist"

**Solução**:
- Confirme que `npx playwright install --with-deps` está executando
- Adicione timeout maior se instalação for lenta

### Cucumber: Todos os Steps "undefined"
**Sintoma**: Relatório mostra todos os steps como não implementados

**Solução**:
- Verifique se `--require features/steps/**/*.js` está no `cucumber.js`
- Confirme que arquivos de steps estão em `features/steps/`

### Cucumber: Timeout em Cenários
**Sintoma**: Steps falham por timeout (padrão: 30s)

**Solução**:
- Aumente timeout no `cucumber.js`: `--timeout 60000`
- Verifique se o site de teste está acessível do runner do GitHub

### Artifacts Não Gerados
**Sintoma**: Seção "Artifacts" vazia na execução

**Solução**:
- Confirme que os paths nos `upload-artifact` steps estão corretos
- Use `if: always()` para garantir upload mesmo em caso de falha
- Adicione `if-no-files-found: warn` para debug

---

## 📈 Métricas e KPIs

### Métricas Monitoradas

**Tempo de Execução**:
- Setup (checkout + deps + browsers): ~2-3 min
- Testes API (Playwright): ~15-30s
- Testes E2E (Cucumber): ~2-5 min
- **Total típico**: ~5-8 minutos

**Taxa de Sucesso**:
- **API**: Esperado 100% (testes determinísticos contra API mock)
- **E2E**: Variável (dependência de site externo)

**Cobertura**:
- API: 7 endpoints do JSONPlaceholder
- E2E: 6 cenários (login + checkout)

### Alertas e Notificações

**Por padrão**, o GitHub notifica via:
- Email (se configurado)
- Interface web (ícone de notificação)

**Configurar alertas customizados**:
- Adicione step de notificação no workflow (Slack, Discord, etc.)
- Use GitHub Apps como Zapier, IFTTT

---

## 🚀 Melhorias Futuras

### Curto Prazo
- [ ] Adicionar matriz de execução (Linux/Windows/macOS)
- [ ] Publicar relatórios no GitHub Pages automaticamente
- [ ] Integrar com ferramenta de gestão de testes (Allure, Report Portal)

### Médio Prazo
- [ ] Executar smoke tests em diferentes browsers (Firefox, Safari)
- [ ] Adicionar testes de performance/carga
- [ ] Implementar testes de acessibilidade (axe-core)

### Longo Prazo
- [ ] Deploy automático de ambiente de staging
- [ ] Testes de regressão visual (Percy, Chromatic)
- [ ] Integração com sistema de qualidade/gates de release

---

## 📞 Suporte e Contato

Para dúvidas sobre o pipeline ou ajustes necessários:
- Abra uma issue no repositório
- Consulte logs detalhados na aba Actions
- Revise este documento e o README principal

**Última atualização**: 24/10/2025
