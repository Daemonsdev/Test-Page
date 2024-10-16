const axios = require('axios');

module.exports = {
  name: 'boxai',
  description: 'Generate a response from the BlackBox AI API based on the user prompt.',
  author: 'Jay',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    if (!prompt) {
      sendMessage(senderId, { text: '🌟 Please provide a prompt for BlackBox AI.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://www.pinkissh.site/api/blackbox?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const text = response.data.response || 'No response received from BlackBox AI. Please try again later.';

      sendMessage(senderId, { text }, pageAccessToken);

    } catch (error) {
      console.error('Error calling BlackBox AI API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
