const express = require('express');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');

const { handleMessage } = require('./handles/handleMessage');
const { handlePostback } = require('./handles/handlePostback');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = 'pagebot';
const PAGE_ACCESS_TOKEN = fs.readFileSync('token.txt', 'utf8').trim();

// Function to send a message via Messenger API
async function sendMessage(senderId, message, pageAccessToken) {
  return await new Promise(async (resolve, reject) => {
    const sendMsg = await axios.post(`https://graph.facebook.com/v21.0/me/messages`,
    {
      recipient: { id: senderId },
      message
    }, {
      params: {
        access_token: pageAccessToken
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = sendMsg.data;
    if (data.error) {
      console.error('Error sending message:', data.error);
      reject(data.error);
    }
    resolve(data);
  });
}

// Function to publish a post to the Facebook feed
async function publishPost(message, access_token) {
  return await new Promise(async (resolve, reject) => {
    const res = await axios.post(`https://graph.facebook.com/v21.0/me/feed`, {
      message,
      access_token
    }, {
      params: {
        access_token
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!res) reject();
    resolve(res.data);
  });
}

// getStarted function to send a template message with buttons
const getStarted = async (send) => send({
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "Welcome! How can I assist you today?",
      buttons: [
        {
          type: "postback",
          title: "Commands",
          payload: "HELP"
        },
        {
          type: "postback",
          title: "About",
          payload: "ABOUT"
        }
      ]
    }
  }
});

// Automatically load commands from the 'commands' folder and post them to Messenger API
const loadMenuCommands = async () => {
  try {
    const commandsDir = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commandsList = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return { name: command.name, description: command.description || 'No description available' };
    });

    const dataCmd = await axios.get(`https://graph.facebook.com/v21.0/me/messenger_profile`, {
      params: {
        fields: "commands",
        access_token: PAGE_ACCESS_TOKEN
      }
    });

    if (dataCmd.data.data[0].commands[0].commands.length === commandsList.length) {
      return console.log("Commands not changed");
    }

    const loadCmd = await axios.post(`https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`, {
      commands: [
        {
          locale: "default",
          commands: commandsList
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (loadCmd.data.result === "success") {
      console.log("Commands loaded!");
    } else {
      console.log("Failed to load commands");
    }
  } catch (error) {
    console.error('Error loading commands:', error);
  }
};

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;

      if (webhookEvent.message) {
        if (webhookEvent.message.text === "GET_STARTED") {
          // Trigger getStarted when the user sends "GET_STARTED"
          await getStarted((message) => sendMessage(senderId, message, PAGE_ACCESS_TOKEN));
        } else {
          handleMessage(webhookEvent, PAGE_ACCESS_TOKEN);
        }
      } else if (webhookEvent.postback) {
        handlePostback(webhookEvent, PAGE_ACCESS_TOKEN);
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  loadMenuCommands();
});
        
