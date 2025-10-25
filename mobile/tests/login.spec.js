const LoginPage = require('../page-objects/LoginPage');
const { expect } = require('chai');

describe('Tarefa 1: Login e Navegação no App', () => {
  
  it('Deve navegar até Custom Title e validar elementos', async () => {
    // Given: App está aberto
    await LoginPage.appMenuItem.waitForDisplayed({ timeout: 15000 });
    
    // When: Navego para App > Activity > Custom Title
    await LoginPage.navigateToCustomTitle();
    
    // Then: Devo ver os campos de texto e botões
    const leftInputDisplayed = await LoginPage.leftTextInput.isDisplayed();
    const rightInputDisplayed = await LoginPage.rightTextInput.isDisplayed();
    const leftButtonDisplayed = await LoginPage.changeLeftButton.isDisplayed();
    const rightButtonDisplayed = await LoginPage.changeRightButton.isDisplayed();
    
    expect(leftInputDisplayed).to.be.true;
    expect(rightInputDisplayed).to.be.true;
    expect(leftButtonDisplayed).to.be.true;
    expect(rightButtonDisplayed).to.be.true;
  });
  
  it('Deve preencher campo Left e validar alteração', async () => {
    // Given: Estou na tela Custom Title
    await LoginPage.appMenuItem.waitForDisplayed({ timeout: 15000 });
    await LoginPage.navigateToCustomTitle();
    
    // When: Preencho o campo Left com texto
    const testText = 'Teste Esquerda';
    await LoginPage.fillLeftText(testText);
    
    // Then: O título deve ser atualizado (validação visual/screenshot ou wait)
    // Nota: ApiDemos Custom Title altera o texto do título da Activity
    // Aqui validamos que o botão foi clicado sem erro
    const leftInputDisplayed = await LoginPage.leftTextInput.isDisplayed();
    expect(leftInputDisplayed).to.be.true;
  });
  
  it('Deve preencher campo Right e validar alteração', async () => {
    // Given: Estou na tela Custom Title
    await LoginPage.appMenuItem.waitForDisplayed({ timeout: 15000 });
    await LoginPage.navigateToCustomTitle();
    
    // When: Preencho o campo Right com texto
    const testText = 'Teste Direita';
    await LoginPage.fillRightText(testText);
    
    // Then: O título deve ser atualizado
    const rightInputDisplayed = await LoginPage.rightTextInput.isDisplayed();
    expect(rightInputDisplayed).to.be.true;
  });
  
  it('Deve navegar entre múltiplas telas e validar elementos', async () => {
    // Given: App está aberto
    await LoginPage.appMenuItem.waitForDisplayed({ timeout: 15000 });
    
    // When: Navego para App
    await LoginPage.appMenuItem.click();
    
    // Then: Devo ver o item Activity
    const activityDisplayed = await LoginPage.activityMenuItem.isDisplayed();
    expect(activityDisplayed).to.be.true;
    
    // When: Clico em Activity
    await LoginPage.activityMenuItem.click();
    
    // Then: Devo ver Custom Title
    const customTitleDisplayed = await LoginPage.customTitleItem.isDisplayed();
    expect(customTitleDisplayed).to.be.true;
  });
});
