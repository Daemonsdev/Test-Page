module.exports = {
  description: "See available commands",
  async run({ api, send }) {
    const quick_replies = [];
    
    // Iterate over the available commands and prepare the quick replies
    api.commands.forEach((name) => {
      quick_replies.push({
        content_type: "text",
        title: name,  // Removed the prefix here
        payload: name.toUpperCase()
      });
    });
    
    try {
      // Send the quick replies along with the button template
      send({
        quick_replies,
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `🤖 | These are the commands available on Wie AI below.
🔎 | Click each command to see its usage.`,
            buttons: [
              {
                type: "web_url",
                url: "https://www.facebook.com/Churchill.Dev4100",
                title: "Contact Admin"
              }
            ]
          }
        }
      });
    } catch (err) {
      // Handle any errors that occur during the sending process
      return send(err.message || err);
    }
  }
};
