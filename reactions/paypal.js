const Discord = require("discord.js");
const mongo = require("../src/connect");
const { paypal_email } = require("../config.json");

function ticketMessage(id) {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setTitle("**Whitelist Ticket (Mọi người vui lòng đọc kĩ hướng dẫn)**")
    .setDescription(
      `Hello <@${id}> ,\n\nbạn vui lòng cung cấp những thông tin sau:`
    )
    .addField(
      "***Lưu ý***: Bấm vào emoji 🔒 để đóng ticket, nếu bạn chưa muốn đóng xin đừng bấm.",
      false
    )
    .addField("1. Tên thật", "VD: Nguyễn Văn A ", false)
    .addField("2. Ngày tháng năm sinh", "VD: 01/01/1990 ", false)
    .addField("3. Tên ingame (nếu đã từng chơi)", "VD: tên ingame cũ ", false)
    .addField(
      "SteamID (hex)",
      `Hướng dẫn lấy steam id 64:\n- Vào steam -> bấm vào tên chọn hồ sơ - > sửa hồ sơ -> ở dòng Hồ sơ của bạn có thể được tìm thấy tại : là link steam của mình ( ví dụ https://steamcommunity.com/id/ender1102/ )\n- copy link đó vào http://vacbanned.com/engine/check\n- Ở Steam3 ID (64bit) có mã  (Hex)  (ví dụ 110000115ea20b8 (Hex)) điền vào câu trả lời Steam ID 64`,
      false
    )
    .addField(
      "4. Link steam",
      "VD: https://steamcommunity.com/profiles/765611913063694",
      false
    )
    .addField(
      "5. Bạn biết đến server qua đâu",
      "VD: qua ai, qua fb nào...",
      false
    )
    .addField(
      "6. Người quen đã được duyệt Whitelist (nếu có)",
      "nêu tên ingame",
      false
    )
    .addField(
      "7. Cam kết khi được duyệt",
      "Cam kết bạn đã đọc kĩ và chơi theo luật server",
      false
    )
    .addField(
      "8. Ngoài ra có gì tốt hơn để duyệt bạn ",
      "như link fb, giấy khen, ....",
      false
    )
    .setFooter("© Threaten")
    .setTimestamp();
}

function SpamTicket(auID, chID) {
  return new Discord.MessageEmbed()
    .setColor("#28df99")
    .setDescription(`<@${auID}> You've Already a Ticket opened at <#${chID}>`)
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
            parent: "867781783827644456",

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
