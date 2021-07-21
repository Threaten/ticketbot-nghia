const Discord = require("discord.js");
const mongo = require("../src/connect.js");

function noAdmin(id) {
  return new Discord.MessageEmbed()
    .setColor("#ff4b5c")
    .setDescription(`<@${id}> You're not a Admin`)
    .setFooter(
      "© Threaten https://cdn.discordapp.com/avatars/259733877826912257/62ba0cc0c81fb92dd8f6356fa757f1bf.png?size=256"
    )
    .setTimestamp();
}

function alreadyDone(id) {
  return new Discord.MessageEmbed()
    .setColor("#ff4b5c")
    .setDescription(
      `<@${id}> This server has already have panel. You can't create another one`
    )
    .setFooter(
      "© Threaten https://cdn.discordapp.com/avatars/259733877826912257/62ba0cc0c81fb92dd8f6356fa757f1bf.png?size=256"
    )
    .setTimestamp();
}

function panelMenu() {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setTitle("Hỗ trợ")
    .setDescription("React emoji để nhận hỗ trợ")
    .addField("Hỗ trợ", "❓\n", true)
    .addField("\u200B", "\u200B", true)
    .addField("Whitelist", "🛂\n", true)
    .setFooter(
      "© Threaten https://cdn.discordapp.com/avatars/259733877826912257/62ba0cc0c81fb92dd8f6356fa757f1bf.png?size=256"
    )
    .setTimestamp();
}

module.exports = {
  name: "panel",
  description: "Redeem ticket messsage",
  cooldown: 3,
  guildOnly: true,
  async execute(message, args) {
    message.delete({ timeout: 1000 });
    if (message.member.hasPermission("ADMINISTRATOR")) {
      mongo.validateGuild(message.guild.id, (result) => {
        if (result) {
          return message.channel
            .send(alreadyDone(message.author.id))
            .then((msg) => {
              msg.delete({ timeout: 15000 });
            });
        } else {
          message.channel.send(panelMenu()).then((msg) => {
            mongo.createPanel(
              message.guild.id,
              message.author.id,
              msg.id,
              async (res) => {
                if (res) {
                  await msg.react("❓");
                  await msg.react("🛂");
                }
              }
            );
          });
        }
      });
    } else {
      return message.channel.send(noAdmin(message.author.id)).then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    }
  },
};
