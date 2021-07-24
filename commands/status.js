const Discord = require("discord.js");
const mongo = require("../src/connect");

function Wrong(auID) {
  return new Discord.MessageEmbed()
    .setColor("#28df99")
    .setDescription(`<@${auID}> Something Went wrong. Please Try again`)
    .setFooter("© Threaten")

    .setTimestamp();
}

function sendReply(auID, status) {
  return new Discord.MessageEmbed()
    .setTitle("***Ticket Status***")
    .setColor("#28df99")
    .addField("Author:", `<@${auID}>`, false)
    .addField("Status", `${status}`, false)
    .setFooter("© Threaten")
    .setTimestamp();
}

function ticket_status(message) {
  try {
    let status = "";
    console.log(message.channel.id);
    mongo.checkTicket(message.channel.id, (test) => {
      if (!test.status) {
        status = "Open";
      } else {
        status = "Closed";
      }
      message.channel
        .send(sendReply(test.authorID, status))
        .then(async (msg) => {
          if (test.status === "closed") {
            await msg.react("🗒️");
            await msg.react("⛔");
          }
        });
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  name: "status",
  description: "Redeem ticket messsage",
  cooldown: 3,
  guildOnly: true,
  async execute(message, args) {
    ticket_status(message);
  },
};
