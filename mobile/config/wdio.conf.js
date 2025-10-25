exports.config = {
  runner: 'local',
  
  specs: [
    './mobile/tests/**/*.spec.js'
  ],
  
  maxInstances: 1,
  
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '13.0',
    'appium:automationName': 'UIA utomator2',
    'appium:app': './mobile/apps/ApiDemos-debug.apk',
    'appium:appWaitActivity': '*',
    'appium:newCommandTimeout': 240,
    'appium:autoGrantPermissions': true,
  }],
  
  logLevel: 'info',
  
  bail: 0,
  
  baseUrl: '',
  
  waitforTimeout: 10000,
  
  connectionRetryTimeout: 120000,
  
  connectionRetryCount: 3,
  
  services: [
    ['appium', {
      args: {
        address: 'localhost',
        port: 4723,
      },
      logPath: './test-results/mobile/'
    }]
  ],
  
  framework: 'mocha',
  
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'test-results/mobile/allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }]
  ],
  
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  
  beforeSession: function () {
    console.log('🚀 Iniciando sessão de testes mobile...');
  },
  
  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  }
}
