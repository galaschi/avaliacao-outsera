// Gera um timestamp amigável para nomear relatórios por execução
const ts = new Date()
  .toISOString()
  .replace(/[:.]/g, '-')
  .replace('T', '-T-');

module.exports = {
    default: `--format progress-bar
              --require features/steps/**/*.js
              --require features/support/**/*.js
              --publish-quiet
              --tags "not @ignore"
              --parallel 1
              --retry 0
              --format ./features/support/custom-reporter.js
              --format json:cucumber-report-${ts}.json`,        
        parallel: '--parallel 1',
        retry: '--retry 1',
        html: `--format html:cucumber-report-${ts}.html`,
        json: `--format json:cucumber-report-${ts}.json`
};