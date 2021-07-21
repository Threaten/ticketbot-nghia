const Discord = require("discord.js");
const mongo = require("../src/connect");
const { paypal_email } = require("../config.json");

function ticketMessage(id) {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setTitle("**Whitelist Ticket**")
    .setDescription(
      `Hello <@${id}> ,\n\nbạn vui lòng cung cấp những thông tin sau:`
    )
    .addField("Tên thật", "VD: Nguyễn Văn A ", false)
    .addField("Tên ingame (nếu đã từng chơi)", "VD: tên ingame cũ ", false)
    .addField("SteamID (hex)", "VD: 110000108b55db1", false)
    .addField(
      "Link steam",
      "https://steamcommunity.com/profiles/765611981063694",
      false
    )
    .addField("Bạn biết đến server qua đâu", "VD: qua ai, qua fb nào...", false)
    .addField(
      "Người quen đã được duyệt Whitelist (nếu có)",
      "nêu tên ingame",
      false
    )
    .addField(
      "Cam kết khi được duyệt",
      "Cam kết bạn đã đọc kĩ và chơi theo luật server",
      false
    )
    .addField(
      "Ngoài ra có gì tốt hơn để duyệt bạn ",
      "như link fb, giấy khen, ....",
      false
    )
    .setTimestamp();
}

function SpamTicket(auID, chID) {
  return new Discord.MessageEmbed()
    .setColor("#28df99")
    .setDescription(`<@${auID}> You've Already a Ticket opened at <#${chID}>`)
    .setTimestamp();
}

function verify_closed(res) {
  var response = {
    status: false,
    channel: null,
  };
  for (data of res) {
    if (data.status !== "closed") {
      response.status = true;
      response.channel = data.channelID;
      break;
    }
  }
  return response;
}

function paypal_ticket(message, user) {
  mongo.validateTicket_Author(user.id, async (res) => {
    try {
      status = verify_closed(res);
      if (status.status === true) {
        return user.send(SpamTicket(user.id, status.channel));
      } else {
        await message.guild.channels
          .create(`whitelist-${user.username}`, {
            type: "text",
            parent: "863661967091826699",

            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: user.id,
                allow: ["VIEW_CHANNEL"],
              },
            ],
          })
          .then((channel) => {
            mongo.validateConfig(message.guild.id, (r) => {
              if (r) {
                if (r.support.roles) {
                  let roles = r.support.roles.split(",");
                  for (let role of roles) {
                    channel.updateOverwrite(role, { VIEW_CHANNEL: true });
                  }
                }

                channel.send(`<@${user.id}>`);
                channel.send(ticketMessage(user.id)).then(async (msg) => {
                  await msg.react("🔒").then((m) => {
                    mongo.newTicket(
                      msg.guild.id,
                      user.id,
                      channel.id,
                      msg.id,
                      (result) => {
                        if (result) {
                          console.log("New Ticket Created Successfully");
                        }
                      }
                    );
                  });
                });
              }
            });
          });
      }
    } catch (error) {}
  });
}

module.exports = { paypal_ticket };
