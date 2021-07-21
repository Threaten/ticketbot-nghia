const Discord = require('discord.js')
const mongo = require('../src/connect.js')

function noAdmin(id){
    return new Discord.MessageEmbed()
        .setColor('#ff4b5c')
        .setDescription(`<@${id}> You're not a Admin`)
        .setTimestamp()
}

function alreadyDone(id){
    return new Discord.MessageEmbed()
        .setColor('#ff4b5c')
        .setDescription(`<@${id}> This server has already have panel. You can't create another one`)
        .setTimestamp()
}

function panelMenu(){
    return new Discord.MessageEmbed()
        .setColor('#bbf1c8')
        .setTitle('Support Ticket')
        .setDescription('Please React to this ticket which justifies your problem')
        .addField('General Questions','❓\n',true)
        .addField('\u200B','\u200B',true)
        .addField('Whitelist','🛂\n',true)
        .setTimestamp()
}

module.exports = {
    name: 'panel',
    description: 'Redeem the Order',
    cooldown: 3,
    guildOnly: true,
    async execute(message, args) {
        message.delete()
        if(message.member.hasPermission('ADMINISTRATOR')){
            mongo.validateGuild(message.guild.id,(result)=>{
                if(result){
                    return message.channel.send(alreadyDone(message.author.id)).then(msg=>{
                        msg.delete({timeout:15000})
                    })
                }
                else{   
                    message.channel.send(panelMenu()).then(msg=>{
                        mongo.createPanel(message.guild.id,message.author.id,msg.id,async (res)=>{
                            if(res){
                                await msg.react('❓')
                                await msg.react('🛂')
                            }
                        })
                    })
                }
            })
            
        }
        else{
            return message.channel.send(noAdmin(message.author.id)).then(msg=>{
                msg.delete({timeout:15000})
            })
        }
    }
}