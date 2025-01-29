class ActionProvider {
  constructor(createChatBotMessage, setState, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setState;
    this.createClientMessage = createClientMessage;
  }

  handleHello() {
    const message = this.createChatBotMessage("Hello! Nice to meet you!");
    this.updateChatbotState(message);
  }

  handleHelp() {
    const message = this.createChatBotMessage(
      "I can help you with various tasks. Try saying hello or asking a question!"
    );
    this.updateChatbotState(message);
  }

  handleDefault() {
    const message = this.createChatBotMessage(
      "I'm not sure I understand. Could you rephrase that?"
    );
    this.updateChatbotState(message);
  }

  updateChatbotState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
