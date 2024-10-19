const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  author: 'System',
  
  // Function to send quick replies
  async sendQuickReplies(senderId, sendMessage) {
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
    });
  },

  // Main function to execute the 'help' command
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return `◉ ${command.name} - ${command.description}`;
    });

    const totalCommands = commandFiles.length;
    const helpMessage = `🌟 Available Commands\n━━━━━━━━━━━━━━━━━━\nTotal commands: ${totalCommands}\n\n${commands.join('\n')}\n\n◉ For further assistance, please contact the developer\n◉ Facebook: https://www.facebook.com/jaymar.dev.00`;

    // Prepare the payload for the command list
    const payload = {
      text: helpMessage,
      buttons: [
        {
          type: 'postback',
          title: 'Contact Developer',
          payload: 'CONTACT_DEVELOPER'
        },
        {
          type: 'web_url',
          title: 'Visit Facebook',
          url: 'https://www.facebook.com/jaymar.dev.00',
          webview_height_ratio: 'full'
        }
      ]
    };

    // Send the help message first
    await sendMessage(senderId, payload, pageAccessToken);

    // Then send the quick replies
    await this.sendQuickReplies(senderId, sendMessage);
  }
};
                                      
