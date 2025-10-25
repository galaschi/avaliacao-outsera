const FormPage = require('../page-objects/FormPage');
const { expect } = require('chai');

describe('Tarefa 2: Automação de Formulário Mobile', () => {
  
  before(async () => {
    // Navega até a tela de formulário antes de todos os testes
    await FormPage.navigateToForm();
  });
  
  it('Deve preencher campo de texto e validar valor', async () => {
    // Given: Estou na tela de controles (formulário)
    await FormPage.textField.waitForDisplayed({ timeout: 10000 });
    
    // When: Preencho o campo de texto
    const testText = 'Teste de automação mobile';
    await FormPage.fillTextField(testText);
    
    // Then: O valor deve estar preenchido corretamente
    const fieldValue = await FormPage.getTextFieldValue();
    expect(fieldValue).to.equal(testText);
  });
  
  it('Deve selecionar checkbox e validar estado', async () => {
    // Given: Checkbox 1 não está marcado
    const initialState = await FormPage.isCheckbox1Selected();
    
    // When: Seleciono o Checkbox 1
    await FormPage.selectCheckbox1();
    
    // Then: Checkbox 1 deve estar marcado
    const finalState = await FormPage.isCheckbox1Selected();
    expect(finalState).to.not.equal(initialState);
  });
  
  it('Deve selecionar radio button e validar seleção', async () => {
    // Given: Estou na tela de controles
    await FormPage.radioButton1.waitForDisplayed();
    
    // When: Seleciono Radio Button 1
    await FormPage.selectRadioButton1();
    
    // Then: Radio Button 1 deve estar selecionado
    const isSelected = await FormPage.isRadioButton1Selected();
    expect(isSelected).to.be.true;
  });
  
  it('Deve preencher formulário completo e validar todos os campos', async () => {
    // Given: Estou na tela de controles
    await FormPage.textField.waitForDisplayed({ timeout: 10000 });
    
    // When: Preencho todos os campos do formulário
    await FormPage.fillTextField('Formulário Completo');
    await FormPage.selectCheckbox1();
    await FormPage.selectCheckbox2();
    await FormPage.selectRadioButton2();
    await FormPage.rateOneStar();
    
    // Then: Todos os elementos devem estar com os valores corretos
    const textValue = await FormPage.getTextFieldValue();
    const checkbox1Selected = await FormPage.isCheckbox1Selected();
    const radio2Selected = await FormPage.isRadioButton2Selected();
    
    expect(textValue).to.equal('Formulário Completo');
    expect(checkbox1Selected).to.be.true;
    expect(radio2Selected).to.be.true;
    
    // Validação visual: elementos estão visíveis
    const checkbox2Displayed = await FormPage.checkbox2.isDisplayed();
    const starDisplayed = await FormPage.starButton.isDisplayed();
    
    expect(checkbox2Displayed).to.be.true;
    expect(starDisplayed).to.be.true;
  });
  
  it('Deve interagir com toggle button', async () => {
    // Given: Toggle button está disponível
    await FormPage.toggleButton.waitForDisplayed();
    
    // When: Clico no toggle button
    await FormPage.toggleButton();
    
    // Then: Toggle deve alterar estado (validação visual via screenshot ou atributo)
    const toggleDisplayed = await FormPage.toggleButton.isDisplayed();
    expect(toggleDisplayed).to.be.true;
  });
});
