module.exports = {
  description: "See available commands",
  async run({ api, send, admin }) {
    const quick_replies = [];
    api.commands.forEach((name) => {
      quick_replies.push({
        content_type: "text",
        title: api.prefix + name,
        payload: name.toUpperCase()
      });
    });
    try {
      send({
        quick_replies,
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `🤖 | These are the commands on Wie AI below.
🔎 | Click every command to see the usage.`,
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
    } catch(err){
      return send(err.message || err);
    }
  }
};
