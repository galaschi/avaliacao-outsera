const FormPage = require('../page-objects/FormPage');
const { expect } = require('chai');

describe('Tarefa 2: Automação de Formulário Mobile', () => {
  
  before(async () => {
    await FormPage.navigateToForm();
  });
  
  it('Deve preencher campo de texto e validar valor', async () => {
    await FormPage.textField.waitForDisplayed({ timeout: 10000 });
    
    const testText = 'Teste de automação mobile';
    await FormPage.fillTextField(testText);
    
    const fieldValue = await FormPage.getTextFieldValue();
    expect(fieldValue).to.equal(testText);
  });
  
  it('Deve selecionar checkbox e validar estado', async () => {
    const initialState = await FormPage.isCheckbox1Selected();
    
    await FormPage.selectCheckbox1();
    
    const finalState = await FormPage.isCheckbox1Selected();
    expect(finalState).to.not.equal(initialState);
  });
  
  it('Deve interagir com múltiplos elementos do formulário', async () => {
    await FormPage.textField.waitForDisplayed({ timeout: 10000 });
    
    await FormPage.fillTextField('Formulário Mobile');
    await FormPage.selectCheckbox2();
    
    const textValue = await FormPage.getTextFieldValue();
    const checkbox2Displayed = await FormPage.checkbox2.isDisplayed();
    
    expect(textValue).to.equal('Formulário Mobile');
    expect(checkbox2Displayed).to.be.true;
  });
});
