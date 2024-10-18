module.exports = {
  name: 'hi',
  description: 'Greet the user and provide instructions',
  author: 'Jay',

  execute(senderId, pageAccessToken, sendMessage) {
    sendMessage(senderId, {
      text: `Hello there! 👋 I'm Heru Bot 🤖, your AI companion, ready to answer your questions. Just type "ai" followed by your question, for example: ai create a Marketing Strategy 💬 If you need more information, type "help" to see all available commands. Thank you for using Heru Bot! 🥹✨`
    }, pageAccessToken);
  }
};
