const Discord = require('discord.js')
const mongo = require('../src/connect')

function ticketMessage(id){
    return new Discord.MessageEmbed()
        .setColor('#bbf1c8')
        .setTitle('**Ticket Reopened**')
        .setDescription(`This ticket Reopened by <@${id}>`)
        .setTimestamp()
}

function Wrong(auID){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setDescription(`<@${auID}> Something Went wrong. Please Try again`)
        .setTimestamp()
}

function ticket_reopen(message,user,result,client){
    try{ 
        message.channel.updateOverwrite(result.authorID, {VIEW_CHANNEL: true}, 'Ticket ReOpened').then(m=>{
            mongo.validateTicket_Channel(message.channel.id,(res)=>{
                if(res){
                    if(res.add[0]){
                        for (let member of res.add){
                            client.users.fetch(member).then(user=>{
                                message.channel.updateOverwrite(user, {VIEW_CHANNEL: true}, 'Ticket-Reopened').then(m1=>{
                                })
                            })
                            
                        }

                        mongo.ticketUpdateStatus_Reopen(message.channel.id,(res1)=>{
                            if(res1){
                                mongo.ticketPanelUpdateStatus_Reopen(message.channel.id,(res)=>{
                                    if(res){
                                        return message.channel.send(ticketMessage(user.id))
                                    }
                                })
                            }
                        })
                    }
                    else{
                        mongo.ticketUpdateStatus_Reopen(message.channel.id,(res1)=>{
                            if(res1){
                                mongo.ticketPanelUpdateStatus_Reopen(message.channel.id,(res)=>{
                                    if(res){
                                        return message.channel.send(ticketMessage(user.id))
                                    }
                                })
                            }
                        })
                    }
                }
            })
            
        }).catch(err2=>{
            console.log(err2)
        })
    }
    catch(err){
        console.log(err)
        return message.channel.send(Wrong(user.id))
    }
}

module.exports = { ticket_reopen }