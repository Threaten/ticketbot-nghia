const Discord = require("discord.js");
const mongo = require("../src/connect.js");

function noAdmin(id) {
  return new Discord.MessageEmbed()
    .setColor("#ff4b5c")
    .setDescription(`<@${id}> You're not a Admin`)
    .setFooter("© Threaten")

    .setTimestamp();
}

function alreadyDone(id) {
  return new Discord.MessageEmbed()
    .setColor("#ff4b5c")
    .setDescription(
      `<@${id}> This server has already have panel. You can't create another one`
    )
    .setFooter("© Threaten")

    .setTimestamp();
}

function panelMenu() {
  return new Discord.MessageEmbed()
    .setColor(`a6a6ed`)
    .setTitle("Tạo hỗ trợ/whitelist")
    .setDescription(
      "Bấm vào emoji ❓ bên dưới để nhận hỗ trợ.\nBấm vào emoji 🛂 bên dưới để nộp đơn whitelist."
    )
    .addField(
      "Có lỗi trong việc tạo ticket (tạo bị lỗi, không tạo được).",
      "Liên hệ trực tiếp với <@259733877826912257>",
      false
    )
    .setFooter("© Threaten")

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
