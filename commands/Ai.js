const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Pose une question à AIchat',
  author: 'Deku (rest api)',
  hasPrefix: false, // Le bot écoutera les messages sans avoir besoin d'un préfixe
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (!prompt) {
      return sendMessage(senderId, { text: "Veuillez entrer une question valide." }, pageAccessToken);
    }

    try {
      // Envoyer un message indiquant que AIchat est en train de répondre
      await sendMessage(senderId, { text: '💬AIchat est en train de te répondre ⏳...\n\n─────★─────' }, pageAccessToken);

      // URL de l'API AIchat
      const apiUrl = `https://www.samirxpikachu.run.place/gemini?text=${encodeURIComponent(prompt)}&system=default&uid=${senderId}`;
      const response = await axios.get(apiUrl);

      const { candidates } = response.data;

      if (candidates && candidates.length > 0) {
        const replyText = candidates[0].content.parts[0].text;

        // Créer un style avec un contour pour la réponse de AIchat
        const formattedResponse = `─────★─────\n` +
                                  `✨🌏AIchat🇲🇬\n\n${replyText}\n` +
                                  `─────★─────`;

        // Gérer les réponses longues de plus de 2000 caractères
        const maxMessageLength = 2000;
        if (formattedResponse.length > maxMessageLength) {
          const chunks = splitMessageIntoChunks(formattedResponse, maxMessageLength);
          for (const chunk of chunks) {
            await sendMessage(senderId, { text: chunk }, pageAccessToken);
          }
        } else {
          await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: 'Désolé, aucune réponse de AIchat.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error calling AI API:', error);
      // Message de réponse d'erreur
      await sendMessage(senderId, { text: 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.' }, pageAccessToken);
    }
  }
};

// Fonction pour découper les messages en morceaux de 2000 caractères
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
