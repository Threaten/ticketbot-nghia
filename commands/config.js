const Discord = require("discord.js");
const mongo = require("../src/connect");
const { prefix } = require("../config.json");

function noAdmin(id) {
  return new Discord.MessageEmbed()
    .setColor("#ff4b5c")
    .setDescription(`<@${id}> You're not a Admin`)
    .setFooter(
      "© Threaten https://cdn.discordapp.com/avatars/259733877826912257/62ba0cc0c81fb92dd8f6356fa757f1bf.png?size=256"
    )
    .setTimestamp();
}

function config_menu(data) {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setTitle("Configuration menu")
    .addField(
      `\`${prefix}config transcript <channelID>\` **- To set the transacript Channel**`,
      `${data.transcript.channel ? `<#${data.transcript.channel}>` : `None`}`
    )
    .addField(
      `\`${prefix}config support <roleID1>,<roleID2>,<roleID3>...\` **- Only these roles can access tickets**`,
      `${
        data.support.roles
          ? `${data.support.roles
              .split(",")
              .map(function (role) {
                return `<@&${role}> `;
              })
              .join("")}`
          : `None`
      }`
    )
    .setFooter(
      "© Threaten https://cdn.discordapp.com/avatars/259733877826912257/62ba0cc0c81fb92dd8f6356fa757f1bf.png?size=256"
    )
    .setTimestamp();
}

function updated() {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setDescription("Data updated ✅")
    .setFooter(
      "© Threaten https://cdn.discordapp.com/avatars/259733877826912257/62ba0cc0c81fb92dd8f6356fa757f1bf.png?size=256"
    )
    .setTimestamp();
}

function missing() {
  return new Discord.MessageEmbed()
    .setColor("#ff4b5c")
    .setDescription("Argument missing")
    .setFooter(
      "© Threaten https://cdn.discordapp.com/avatars/259733877826912257/62ba0cc0c81fb92dd8f6356fa757f1bf.png?size=256"
    )
    .setTimestamp();
}

module.exports = {
  name: "config",
  description: "Configuartion to server",
  cooldown: 3,
  guildOnly: true,
  usage: `[command] [value]`,
  async execute(message, args, client) {
    message.delete();
    if (message.member.hasPermission("ADMINISTRATOR")) {
      mongo.validateConfig(message.guild.id, (res) => {
        if (res) {
          if (!args[0]) {
            return message.channel.send(config_menu(res));
          } else if (args[0].toLowerCase() === "transcript") {
            if (!args[1]) {
              return message.channel.send(missing()).then((msg) => {
                msg.delete({ timeout: 15000 });
              });
            } else {
              client.channels.fetch(args[1]).then((channel) => {
                channel
                  .createWebhook("Threaten Transcript ", {
                    avatar:
                      "https://cdn.discordapp.com/avatars/259733877826912257/62ba0cc0c81fb92dd8f6356fa757f1bf.png?size=256",
                  })
                  .then((webhook) => {
                    mongo.updateTranscript(
                      message.guild.id,
                      args[1],
                      webhook.id,
                      webhook.token,
                      (res) => {
                        if (res) {
                          return message.channel.send(updated()).then((msg) => {
                            msg.delete({ timeout: 15000 });
                          });
                        }
                      }
                    );
                  });
              });
            }
          } else if (args[0].toLowerCase() === "support") {
            if (!args[1]) {
              return message.channel.send(missing()).then((msg) => {
                msg.delete({ timeout: 15000 });
              });
            } else {
              mongo.updateRoles(message.guild.id, args[1], (res) => {
                if (res) {
                  return message.channel.send(updated()).then((msg) => {
                    msg.delete({ timeout: 15000 });
                  });
                }
              });
            }
          } else {
            return message.reply("Command not found").then((msg) => {
              msg.delete({ timeout: 15000 });
            });
          }
        } else {
          return message.reply(
            "This server is not registered. \nuse `-setup` to register this server"
          );
        }
      });
    } else {
      return message.channel.send(noAdmin(message.author.id)).then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    }
  },
};
