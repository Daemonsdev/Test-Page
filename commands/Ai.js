const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Automatically respond to any message using Heru Bot',
  author: 'Jay Mar',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a question.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://heru-ai-1kgm.vercel.app/heru?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200 && response.data && response.data.response) {
        const text = response.data.response;
        const guide = '\n\n◉ Guide: Type "help" to see all available commands';

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
      } else {
        console.error('Unexpected API response format:', response.data);
        sendMessage(senderId, { text: 'Sorry, the Heru API returned an unexpected response.' }, pageAccessToken);
      }

    } catch (error) {
      if (error.response) {
        console.error('API responded with error:', error.response.status, error.response.data);
        sendMessage(senderId, { text: `Error: The API responded with a ${error.response.status} status.` }, pageAccessToken);
      } else if (error.request) {
        console.error('No response received from API:', error.request);
        sendMessage(senderId, { text: 'Error: No response received from the Heru API.' }, pageAccessToken);
      } else {
        console.error('Error during API request:', error.message);
        sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
      }
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
                               
