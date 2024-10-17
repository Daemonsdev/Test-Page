const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Ask a question to Heru Bot',
  author: 'Jay Mar',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    try {
      const apiUrl = `https://heru-ai-1kgm.vercel.app/heru?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response || 'No response received from the Heru API. Please try again later.';
      const guide = '\n\n◉ Guide: Type "help" to see all available commands';

      console.log('API Response:', text);

      const maxMessageLength = 2000;
      const finalText = text + guide;
      if (finalText.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(finalText, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: finalText }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Heru API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
      }
