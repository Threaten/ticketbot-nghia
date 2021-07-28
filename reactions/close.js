const Discord = require("discord.js");
const mongo = require("../src/connect");

function ticketMessage(id) {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setTitle("**Ticket Closed**")
    .setDescription(`This ticket closed by <@${id}>`)
    .setFooter("© Threaten")

    .setTimestamp();
}

function Wrong(auID) {
  return new Discord.MessageEmbed()
    .setColor("#28df99")
    .setDescription(`<@${auID}> Something Went wrong. Please Try again`)
    .setFooter("© Threaten")

    .setTimestamp();
}

function ticket_close(message, user, result) {
  try {
    mongo.ticketUpdateStatus_Close(message.channel.id, async (res) => {
      if (res) {
        await message.channel
          .updateOverwrite(
            result.authorID,
            { VIEW_CHANNEL: false },
            "Ticket Closed"
          )
          .then(async (m) => {
            if (result.add) {
              for (let member of result.add) {
                message.channel.updateOverwrite(member, {
                  VIEW_CHANNEL: false,
                });
              }
            }
            await message.channel
              .send(ticketMessage(user.id))
              .then(async (msg) => {
                await msg.react("🔓");
                await msg.react("🗒️");
                await msg.react("⛔").then((m) => {
                  mongo.validateTicketPanel_Channel(
                    message.channel.id,
                    (res1) => {
                      if (res1) {
                        mongo.ticketPanelUpdateStatus_Close(
                          message.channel.id,
                          msg.id,
                          (res2) => {
                            if (res2) {
                              return console.log(
                                "Ticket Close Panel Updated and Ticket Closed"
                              );
                            }
                          }
                        );
                      } else {
                        mongo.newTicketPanel(
                          message.guild.id,
                          user.id,
                          message.channel.id,
                          msg.id,
                          (r) => {
                            if (r) {
                              mongo.ticketPanelUpdateStatus_Close(
                                message.channel.id,
                                msg.id,
                                (r1) => {
                                  if (r1) {
                                    return console.log(
                                      "Ticket Closed Successfully"
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                });
              });
          });
      }
    });
  } catch (err) {
    console.log(err);
    return message.channel.send(Wrong(user.id));
  }
}

module.exports = { ticket_close };
