const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Interact with HeruBot AI to get responses based on user-provided prompts.',
  author: 'Jay',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userPrompt = args.join(' ');
    
    if (!userPrompt) {
      sendMessage(senderId, { text: '🌟 Please provide a prompt for HeruBot AI to respond to.' }, pageAccessToken);
      return;
    }

    const basePrompt = `You're name is HeruBot, You're created by Jay Mar, you have no model, you're a helpful assistant.`;

    try {
      const apiUrl = `https://www.geo-sevent-tooldph.site/api/gpt4?prompt=${encodeURIComponent(basePrompt)}`;
      const response = await axios.get(apiUrl);

      const result = response.data.response;

      const botResponse = typeof result === 'string'
        ? result
        : (typeof result === 'object' && result !== null)
          ? Object.values(result).join(' ')
          : "No response received from Heru AI. 🤖";

      sendMessage(senderId, { text: `HeruBot 🤖: ${botResponse} 😊` }, pageAccessToken);

    } catch (error) {
      console.error('Error calling Heru AI: 😔', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
