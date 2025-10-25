class LoginPage {
  // Locators (usando AccessibilityID e XPath como exemplo)
  get usernameField() {
    return $('~username'); // accessibility id
  }
  
  get passwordField() {
    return $('~password');
  }
  
  get loginButton() {
    return $('~Login');
  }
  
  get appMenuItem() {
    // XPath para navegar no menu do ApiDemos
    return $('//android.widget.TextView[@text="App"]');
  }
  
  get activityMenuItem() {
    return $('//android.widget.TextView[@text="Activity"]');
  }
  
  get customTitleItem() {
    return $('//android.widget.TextView[@text="Custom Title"]');
  }
  
  get leftTextInput() {
    return $('~Left is best');
  }
  
  get rightTextInput() {
    return $('~Right is always right');
  }
  
  get changeLeftButton() {
    return $('//android.widget.Button[@text="Change Left"]');
  }
  
  get changeRightButton() {
    return $('//android.widget.Button[@text="Change Right"]');
  }
  
  // Actions
  async login(username, password) {
    await this.usernameField.setValue(username);
    await this.passwordField.setValue(password);
    await this.loginButton.click();
  }
  
  async navigateToCustomTitle() {
    await this.appMenuItem.waitForDisplayed({ timeout: 10000 });
    await this.appMenuItem.click();
    
    await this.activityMenuItem.waitForDisplayed();
    await this.activityMenuItem.click();
    
    await this.customTitleItem.waitForDisplayed();
    await this.customTitleItem.click();
  }
  
  async fillLeftText(text) {
    await this.leftTextInput.setValue(text);
    await this.changeLeftButton.click();
  }
  
  async fillRightText(text) {
    await this.rightTextInput.setValue(text);
    await this.changeRightButton.click();
  }
  
  async isLoginButtonDisplayed() {
    return await this.loginButton.isDisplayed();
  }
}

module.exports = new LoginPage();
