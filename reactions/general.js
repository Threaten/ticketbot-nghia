const Discord = require("discord.js");
const mongo = require("../src/connect");

function ticketMessage(id) {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setTitle("**Ticket**")
    .setDescription(
      `Chào <@${id}> ,\nbạn vui lòng đặt câu hỏi tại đây. Sẽ có người hỗ trợ bạn trong thời gian sớm nhất`
    )
    .addField(
      "***Lưu ý***:",
      "Bấm vào emoji 🔒 để đóng ticket, nếu bạn chưa muốn đóng xin đừng bấm.",
      false
    )
    .setFooter("© Threaten")

    .setTimestamp();
}

function SpamTicket(auID, chID) {
  return new Discord.MessageEmbed()
    .setColor("#28df99")
    .setDescription(`<@${auID}> Bạn đã có ticket <#${chID}>`)
    .setFooter("© Threaten")

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

function general_ticket(message, user) {
  mongo.validateTicket_Author(user.id, async (res) => {
    try {
      status = verify_closed(res);
      if (status.status === true) {
        return user.send(SpamTicket(user.id, status.channel));
      } else {
        await message.guild.channels
          .create(`support-${user.username}`, {
            type: "text",
            //parent: "863661967091826699",
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: user.id,
                allow: ["VIEW_CHANNEL"],
              },
              // {
              //   id: "849109991260553226",
              //   allow: ["VIEW_CHANNEL"],
              // },
              // {
              //   id: "259733877826912257",
              //   allow: ["VIEW_CHANNEL"],
              // },
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

module.exports = { general_ticket };
