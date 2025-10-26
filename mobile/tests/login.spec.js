const LoginPage = require('../page-objects/LoginPage');
const { expect } = require('chai');

describe('Tarefa 1: Login e Navegação no App', () => {
  
  before(async () => {
    await LoginPage.appMenuItem.waitForDisplayed({ timeout: 15000 });
    await LoginPage.navigateToCustomTitle();
  });
  
  it('Deve navegar até Custom Title e validar elementos', async () => {
    const leftInputDisplayed = await LoginPage.leftTextInput.isDisplayed();
    const rightInputDisplayed = await LoginPage.rightTextInput.isDisplayed();
    const leftButtonDisplayed = await LoginPage.changeLeftButton.isDisplayed();
    const rightButtonDisplayed = await LoginPage.changeRightButton.isDisplayed();
    
    expect(leftInputDisplayed).to.be.true;
    expect(rightInputDisplayed).to.be.true;
    expect(leftButtonDisplayed).to.be.true;
    expect(rightButtonDisplayed).to.be.true;
  });
  
  it('Deve interagir com botões e validar elementos permanecem visíveis', async () => {
    await LoginPage.changeLeftButton.click();
    await LoginPage.changeRightButton.click();
    
    const leftDisplayed = await LoginPage.leftTextInput.isDisplayed();
    const rightDisplayed = await LoginPage.rightTextInput.isDisplayed();
    const leftButtonDisplayed = await LoginPage.changeLeftButton.isDisplayed();
    const rightButtonDisplayed = await LoginPage.changeRightButton.isDisplayed();
    
    expect(leftDisplayed).to.be.true;
    expect(rightDisplayed).to.be.true;
    expect(leftButtonDisplayed).to.be.true;
    expect(rightButtonDisplayed).to.be.true;
  });
});
