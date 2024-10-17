const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Generate response from Heru AI or analyze photo',
  author: 'Jay',

  async execute(senderId, message, pageAccessToken, sendMessage) {
    if (message.text) {
      const prompt = message.text.trim();
      if (!prompt) {
        sendMessage(senderId, { text: '🌟 Please provide a prompt for AI.' }, pageAccessToken);
        return;
      }

      try {
        const apiUrl = `https://heru-ai-1kgm.vercel.app/heru?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);

        const text = response.data.response || 'No response received from Heru AI. Please try again later.';
        sendMessage(senderId, { text }, pageAccessToken);

      } catch (error) {
        console.error('Error calling Heru AI API:', error);
        sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
      }

    } else if (message.attachments && message.attachments[0].type === 'image') {
      const imageUrl = message.attachments[0].payload.url;

      try {
        const apiUrl = `https://www.pinkissh.site/api/llamavision?prompt=&imageUrl=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(apiUrl);

        const analysis = response.data.response || 'No analysis could be generated for this image.';
        sendMessage(senderId, { text: `🖼️ Image Analysis: ${analysis}` }, pageAccessToken);

      } catch (error) {
        console.error('Error analyzing image:', error);
        sendMessage(senderId, { text: 'Sorry, there was an error analyzing the image.' }, pageAccessToken);
      }
    } else {
      sendMessage(senderId, { text: 'Please send a text prompt or an image for analysis.' }, pageAccessToken);
    }
  }
};
        
