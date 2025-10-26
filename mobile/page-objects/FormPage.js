class FormPage {
  // Locators
  get viewsMenuItem() {
    return $('//android.widget.TextView[@text="Views"]');
  }
  
  get controlsMenuItem() {
    return $('//android.widget.TextView[@text="Controls"]');
  }
  
  get lightThemeItem() {
    return $('//android.widget.TextView[@text="1. Light Theme"]');
  }
  
  get textField() {
    return $('android=new UiSelector().className("android.widget.EditText").instance(0)');
  }
  
  get checkbox1() {
    return $('//android.widget.CheckBox[@text="Checkbox 1"]');
  }
  
  get checkbox2() {
    return $('//android.widget.CheckBox[@text="Checkbox 2"]');
  }
  
  // Actions
  async navigateToForm() {
    await this.viewsMenuItem.waitForDisplayed({ timeout: 10000 });
    await this.viewsMenuItem.click();
    
    await this.controlsMenuItem.waitForDisplayed();
    await this.controlsMenuItem.click();
    
    await this.lightThemeItem.waitForDisplayed();
    await this.lightThemeItem.click();
  }
  
  async fillTextField(text) {
    await this.textField.waitForDisplayed();
    await this.textField.setValue(text);
  }
  
  async selectCheckbox1() {
    await this.checkbox1.click();
  }
  
  async selectCheckbox2() {
    await this.checkbox2.click();
  }
  
  async isCheckbox1Selected() {
    const isSelected = await this.checkbox1.getAttribute('checked');
    return isSelected === 'true';
  }
  
  async getTextFieldValue() {
    return await this.textField.getText();
  }
}

module.exports = new FormPage();
