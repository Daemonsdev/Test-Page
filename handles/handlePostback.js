const { sendMessage } = require('./sendMessage');

async function sendQuickReplies(senderId, pageAccessToken) {
  const quickReplies = [
    {
      content_type: "text",
      title: "Get Help",
      payload: "GET_HELP",
    },
    {
      content_type: "text",
      title: "Ask AI",
      payload: "ASK_AI",
    },
  ];

  await sendMessage(senderId, {
    text: "What would you like to do?",
    quick_replies: quickReplies,
  }, pageAccessToken);
}

function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  // Handle specific postback payloads
  if (payload === 'GET_STARTED') {
    sendQuickReplies(senderId, pageAccessToken);
  } else {
    sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
  }
}

module.exports = { handlePostback };
