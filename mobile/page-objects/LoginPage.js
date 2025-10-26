class LoginPage {
  // Locators
  get appMenuItem() {
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
  async navigateToCustomTitle() {
    await this.appMenuItem.waitForDisplayed({ timeout: 10000 });
    await this.appMenuItem.click();
    
    await this.activityMenuItem.waitForDisplayed();
    await this.activityMenuItem.click();
    
    await this.customTitleItem.waitForDisplayed();
    await this.customTitleItem.click();
  }
}

module.exports = new LoginPage();
