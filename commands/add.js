const Discord = require("discord.js");
const mongo = require("../src/connect");

function noArgs(id) {
  return new Discord.MessageEmbed()
    .setColor("#ff4b5c")
    .setDescription(`<@${id}> You didn't specified any argument`)
    .setFooter("© Threaten")

    .setTimestamp();
}

function added(id) {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setDescription(`<@${id}> Added to Ticket`)
    .setFooter("© Threaten")

    .setTimestamp();
}

function author(client, args) {
  return new Promise((resolve, reject) => {
    client.users
      .fetch(args[0])
      .then((au) => {
        resolve(au);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  name: "add",
  description: "Adds new user to ticket",
  cooldown: 3,
  guildOnly: true,
  args: true,
  usage: `<@mention> || <MemberID> `,
  async execute(message, args, client) {
    message.delete();
    if (message.mentions.users.size) {
      const ID = message.mentions.users.first();
      var auID = ID.id;
      mongo.validateTicket_Channel(message.channel.id, (res) => {
        if (res) {
          message.channel
            .updateOverwrite(auID, { VIEW_CHANNEL: true }, "Added to Ticket")
            .then((m) => {
              mongo.updateTicketAdd(message.channel.id, auID, (r) => {
                if (r) {
                  return message.channel.send(added(auID));
                }
              });
            });
        }
      });
    } else {
      author(client, args).then((auID) => {
        mongo.validateTicket_Channel(message.channel.id, (res) => {
          if (res) {
            message.channel
              .updateOverwrite(auID, { VIEW_CHANNEL: true }, "Added to Ticket")
              .then((m) => {
                mongo.updateTicketAdd(message.channel.id, auID.id, (r) => {
                  if (r) {
                    return message.channel.send(added(auID.id));
                  }
                });
              });
          }
        });
      });
    }
  },
};
