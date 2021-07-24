const Discord = require("discord.js");
const mongo = require("../src/connect");
const { paypal_email } = require("../config.json");
const { execute } = require("./panel");

function noAdmin(id) {
  return new Discord.MessageEmbed()
    .setColor("#ff4b5c")
    .setDescription(`<@${id}> You're not a Admin`)
    .setFooter("© Threaten")

    .setTimestamp();
}

function convert(str) {
  var date = new Date(str),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  hour = date.getHours();
  minute = date.getMinutes();
  var result = `${[day, month, date.getFullYear()].join(
    "/"
  )} ${hour}:${minute}`;
  return result;
}

function ticketMessage(id) {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setTitle("**Blacklist User from issuing ticket**")
    .setDescription(
      `Hello <@${id}> ,\n\nit will blacklist user for 1 day from issuing any ticket`
    )
    .setFooter("© Threaten")
    .setTimestamp();
}

function SpamTicket(auID, blacklistedID, reason, issuedBy, time) {
  return new Discord.MessageEmbed()
    .setColor("#28df99")
    .setDescription(`<@${auID}>, <@${blacklistedUser}> has been blacklisted.`)
    .addField("Reason", reason, false)
    .addField("Issued By:", `<@${issuedBy}>`, false)
    .addField("Blacklisted at:", convert(time), false)
    .setFooter("© Threaten")

    .setTimestamp();
}

function verify_blacklisted(res) {
  var response = {
    status: false,
    blacklisted: null,
  };
  for (data of res) {
    if (data) {
      response.status = true;
      response.blacklisted = data;
      break;
    }
  }
  return response;
}

function BanTicket(blacklistedUser, reason, issuedBy, time) {
  return new Discord.MessageEmbed()
    .setColor("#28df99")
    .setDescription(
      `You have blacklisted <@${blacklistedUser} from issuing ticket`
    )
    .addField("Reason", reason, false)
    .addField("Issued By:", `<@${issuedBy}>`, false)
    .addField("Banned at:", time, false)
    .setFooter("© Threaten")

    .setTimestamp();
}

function blacklist_ticket(message, user) {}

module.exports = {
  name: "blacklist",
  description: "Blacklist user from issuing ticket",
  cooldown: 3,
  guildOnly: true,
  async execute(message, args) {
    message.delete({ timeout: 1000 });
    if (message.member.hasPermission("ADMINISTRATOR")) {
      blacklistedUser = message.mentions.users.first().id;
      if (!args.slice(1).join(" ")) {
        reason = "No reason specified";
      }
      reason = args.slice(1).join(" ");
      issuedBy = message.author.id;
      date = new Date().toUTCString();
      var date = new Date(date),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      hour = date.getHours();
      minute = date.getMinutes();
      var result = `${[day, month, date.getFullYear()].join(
        "/"
      )} ${hour}:${minute}`;

      mongo.blacklist(message.mentions.users.first().id, async (res) => {
        try {
          mongo.blacklist(blacklistedUser, async (cb) => {
            if (cb) {
              return message.author.send(
                SpamTicket(
                  message.author.id,
                  cb.authorID,
                  cb.reason,
                  cb.issuedBy,
                  cb.createdAt
                )
              );
            } else {
              await mongo.newBlacklist(
                message.mentions.users.first().id,
                reason,
                issuedBy,
                async (callback) => {
                  if (callback) {
                    await message.author.send(
                      BanTicket(blacklistedUser, reason, issuedBy, result)
                    );
                  } else {
                    console.log("err");
                  }
                }
              );
            }
          });
        } catch (error) {}
      });
    } else {
      return message.channel.send(noAdmin(message.author.id)).then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    }
  },
};
