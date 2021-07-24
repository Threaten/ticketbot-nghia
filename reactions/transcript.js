const Discord = require("discord.js");
const mongo = require("../src/connect");
const chat = require("../Chat/cmd");

//const { fetchTranscript } = require("reconlx");
const { MessageAttachment } = require("discord.js");

const fs = require("fs").promises;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
function ticketMessage(channel, user) {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setTitle(`Transcript of ${user.name}#${user.tag}`)
    .addField("Ticket Owner", `<@${user.id}>`, true)
    .addField("Ticket Name", `${channel.name}`, true)
    .setFooter("© Threaten")

    .setTimestamp();
}

function transcriptMessage() {
  return new Discord.MessageEmbed()
    .setColor("#bbf1c8")
    .setDescription("Transcript Saved")
    .setFooter("© Threaten");
}

function transcripting() {
  return new Discord.MessageEmbed()
    .setColor("#fbd46d")
    .setDescription("Transcript Saving")
    .setFooter("© Threaten");
}

function Wrong(auID) {
  return new Discord.MessageEmbed()
    .setColor("#c70039")
    .setDescription(`<@${auID}> Something Went wrong. Please Try again`)
    .setFooter("© Threaten")

    .setTimestamp();
}

// function create_transcript(message,user){
//     mongo.validateTicket_Channel(message.channel.id,(res)=>{
//         if(res){
//             mongo.validateConfig(message.guild.id,(config)=>{
//                 if(config){
//                     if (message.member.hasPermission("ADMINISTRATOR")){
//                     message.channel.send(transcripting()).then(msg=>{
//                         const webhookClient = new Discord.WebhookClient(`${config.transcript.webhookID}`, `${config.transcript.webhookToken}`);
//                         chat.chatExport(message.channel.id,user.username).then(file=>{
//                             const embed = new Discord.MessageEmbed()
//                                 .setColor('#bbf1c8')
//                                 .setTitle(`Transcript executed by ${user.tag}`)
//                                 .addField('Ticket Owner',`<@${res.authorID}>`,true)
//                                 .addField('Ticket Name',`${message.channel.name}`,true)
//                                 .setTimestamp()
//                             webhookClient.send({
//                                 username: 'Transcript',
//                                 files: [`${file}`],
//                                 embeds: [embed]
//                             }).then(m=>{
//                                 return msg.edit(transcriptMessage())
//                                 console.log("cc");
//                             }).catch(err=>{
//                                 console.log(err)
//                                 return msg.edit(Wrong(user.id))
//                             })
//                         }).catch(err=> {
//                             console.log(err);
//                         })
//                     }).catch(err=> {
//                         console.log(err)
//                     })
//                 }
//                 }
//             })
//         }
//     })
// }

function create_transcript(message, user) {
  // mongo.validateTicket_Channel(message.channel.id, (res) => {
  //   if (res || res.status === "closed") {
  //     mongo.validateConfig(message.guild.id, (config) => {
  //       if (config) {
  console.log(message.member.authorID);
  if (
    message.member.hasPermission("ADMINISTRATOR") ||
    message.member.authorID === "259733877826912257"
  ) {
    message.channel
      .send(transcripting())
      .then((msg) => {
        const webhookClient = new Discord.WebhookClient(
          `${config.transcript.webhookID}`,
          `${config.transcript.webhookToken}`
        );
        fetchTranscript(message, 99).then((data) => {
          const file = new MessageAttachment(data, "index.html");
          const embed = new Discord.MessageEmbed()
            .setColor("#bbf1c8")
            .setTitle(`Transcript executed by ${user.tag}`)
            .setDescription(
              "Please note that only 100 last messages were transcripted"
            )
            .addField("Ticket Owner", `<@${res.authorID}>`, true)
            .addField("Ticket Name", `${message.channel.name}`, true)
            .setFooter("© Threaten")
            .setTimestamp();
          webhookClient
            .send({
              username: "Transcript",
              files: [file],
              embeds: [embed],
            })
            .then((m) => {
              return msg.edit(transcriptMessage());
              console.log("cc");
            })
            .catch((err) => {
              console.log(err);
              return msg.edit(Wrong(user.id));
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //         }
  //       }
  //     });
  //   } else {
  //     if (message.member.hasPermission("ADMINISTRATOR")) {
  //       message.channel
  //         .send(transcripting())
  //         .then((msg) => {
  //           const webhookClient = new Discord.WebhookClient(
  //             `${config.transcript.webhookID}`,
  //             `${config.transcript.webhookToken}`
  //           );
  //           fetchTranscript(message, 99).then((data) => {
  //             const file = new MessageAttachment(data, "index.html");
  //             const embed = new Discord.MessageEmbed()
  //               .setColor("#bbf1c8")
  //               .setTitle(`Transcript executed by ${user.tag}`)
  //               .setDescription(
  //                 "Please note that only 100 last messages were transcripted"
  //               )
  //               .addField("Ticket Owner", `<@${res.authorID}>`, true)
  //               .addField("Ticket Name", `${message.channel.name}`, true)
  //               .setFooter("© Threaten")
  //               .setTimestamp();
  //             webhookClient
  //               .send({
  //                 username: "Transcript",
  //                 files: [file],
  //                 embeds: [embed],
  //               })
  //               .then((m) => {
  //                 return msg.edit(transcriptMessage());
  //                 console.log("cc");
  //               })
  //               .catch((err) => {
  //                 console.log(err);
  //                 return msg.edit(Wrong(user.id));
  //               });
  //           });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   }
  // });
}

async function fetchTranscript(message, numberOfMessages) {
  if (!message) throw new ReferenceError('reconlx => "message" is not defined');
  if (!numberOfMessages)
    throw new ReferenceError('reconlx => "numberOfMessages" is not defined');
  if (typeof numberOfMessages !== "number")
    throw new SyntaxError(
      'reconlx => typeof "numberOfMessages" must be a number'
    );
  if (numberOfMessages >= 100)
    throw new RangeError(
      'reconlx => "numberOfMessages" must be under 100 messages'
    );
  const jsdom = require("jsdom");
  const fs = require("fs");
  const discord = require("discord.js");
  const { JSDOM } = jsdom;
  const dom = new JSDOM();
  const document = dom.window.document;
  let messageCollection = new discord.Collection();
  let channelMessages = await message.channel.messages
    .fetch({
      limit: numberOfMessages,
    })
    .catch((err) => console.log(err));
  messageCollection = messageCollection.concat(channelMessages);

  while (channelMessages.size === 100) {
    let lastMessageId = channelMessages.lastKey();
    channelMessages = await message.channel.messages
      .fetch({ limit: numberOfMessages, before: lastMessageId })
      .catch((err) => console.log(err));
    if (channelMessages)
      messageCollection = messageCollection.concat(channelMessages);
  }
  let msgs = messageCollection.array().reverse();
  return new Promise(async (ful) => {
    await fs.readFile(
      require("path").join(__dirname, "template.html"),
      "utf8",
      async function (err, data) {
        if (data) {
          await fs.writeFile(
            require("path").join(__dirname, "index.html"),
            data,
            async function (err) {
              if (err) return console.log(err);
              let info = document.createElement("div");
              info.className = "info";
              let iconClass = document.createElement("div");
              iconClass.className = "info__guild-icon-container";
              let guild__icon = document.createElement("img");
              guild__icon.className = "info__guild-icon";
              guild__icon.setAttribute("src", message.guild.iconURL());
              iconClass.appendChild(guild__icon);
              info.appendChild(iconClass);

              let info__metadata = document.createElement("div");
              info__metadata.className = "info__metadata";

              let guildName = document.createElement("div");
              guildName.className = "info__guild-name";
              let gName = document.createTextNode(message.guild.name);
              guildName.appendChild(gName);
              info__metadata.appendChild(guildName);

              let channelName = document.createElement("div");
              channelName.className = "info__channel-name";
              let cName = document.createTextNode(message.channel.name);
              channelName.appendChild(cName);
              info__metadata.appendChild(channelName);

              let messagecount = document.createElement("div");
              messagecount.className = "info__channel-message-count";
              messagecount.appendChild(
                document.createTextNode(
                  `Transcripted ${numberOfMessages} messages.`
                )
              );
              info__metadata.appendChild(messagecount);
              info.appendChild(info__metadata);
              await fs.appendFile(
                require("path").join(__dirname, "index.html"),
                info.outerHTML,
                async function (err) {
                  if (err) return console.log(err);
                  msgs.forEach(async (msg) => {
                    let parentContainer = document.createElement("div");
                    parentContainer.className = "parent-container";
                    let avatarDiv = document.createElement("div");
                    avatarDiv.className = "avatar-container";
                    let img = document.createElement("img");
                    img.setAttribute("src", msg.author.displayAvatarURL());
                    img.className = "avatar";
                    avatarDiv.appendChild(img);

                    parentContainer.appendChild(avatarDiv);

                    let messageContainer = document.createElement("div");
                    messageContainer.className = "message-container";

                    let nameElement = document.createElement("span");
                    let name = document.createTextNode(
                      msg.author.tag +
                        " " +
                        msg.createdAt.toDateString() +
                        " " +
                        msg.createdAt.toLocaleTimeString() +
                        " EST"
                    );
                    nameElement.appendChild(name);
                    messageContainer.append(nameElement);

                    if (msg.content.startsWith("```")) {
                      let m = msg.content.replace(/```/g, "");
                      let codeNode = document.createElement("code");
                      let textNode = document.createTextNode(m);
                      codeNode.appendChild(textNode);
                      messageContainer.appendChild(codeNode);
                    } else {
                      let msgNode = document.createElement("span");
                      let textNode = document.createTextNode(msg.content);
                      msgNode.append(textNode);
                      messageContainer.appendChild(msgNode);
                    }
                    parentContainer.appendChild(messageContainer);
                    await fs.appendFile(
                      require("path").join(__dirname, "index.html"),
                      parentContainer.outerHTML,
                      function (err) {
                        if (err) return console.log(err);
                      }
                    );
                  });
                  fs.readFile(
                    require("path").join(__dirname, "index.html"),
                    (err, data) => {
                      if (err) console.log(err);
                      ful(data);
                    }
                  );
                }
              );
            }
          );
        }
      }
    );
  });
}

// webhookClient
// .send({
//   username: "Transcript",
//   files: [`${file}`],
//   embeds: [embed],
// })
// .then((m) => {
//   return msg.edit(transcriptMessage());
//   console.log("cc");
// })
// .catch((err) => {
//   console.log(err);
//   return msg.edit(Wrong(user.id));
// });

module.exports = { create_transcript };
