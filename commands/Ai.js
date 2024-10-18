const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Generate response from AI',
  author: 'Jay',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    if (!prompt) {
      sendMessage(senderId, {
        text: `Hello, I'm Heru Bot 🤖, your virtual assistant, ready to help with whatever you need! Whether it's answering questions, solving problems, or offering guidance, I'm here for you. How can I assist you today? 😊`
      }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://heru-ai-1kgm.vercel.app/heru?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const text = response.data.response || 'No response received from the AI. Please try again later.';

      sendMessage(senderId, { text }, pageAccessToken);

    } catch (error) {
      console.error('Error calling AI API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
