const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Ask a question to GPT-4 via Heru API',
  author: 'Jay Mar',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a prompt to ask GPT-4.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://heru-ai-1kgm.vercel.app/heru?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.result || 'No response received from the Heru API. Please try again later.';

      console.log('API Response:', text);

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text }, pageAccessToken);
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
