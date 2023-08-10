import connect from "./connection.js";
import azure_yomiage from "./yomiage.js"
import { getVoiceConnection} from "@discordjs/voice";
import {player,client} from "../index.js"
import {spam,spam_stop}from "./spam.js"
import {DisconnectEmbed,VCError1,VCError2,SkipEmbed,PingEmbed} from "./Embed.js"


export let lockflag = false

export function modifyLock( value ) { lockflag = value; }

/**
 * slashコマンド一覧入手
 * @returns commands
 */
export function commands(){
    const ping = {
        name: "ping",
        description: "pongと返信します。",
    }
    const join = {
        name:"join",
        description: "ボイスチャットに接続します",
    }

    const bye = {
        name:"bye",
        description:"ボイスチャットから切断します",
    }

    const voice = {
        name:"voice",
        description:"感情を持つbotちゃん",
        options: [
            {
            type: 3,
            name: "content",
            description: "会話を始めよう",
            required: true,
            }
        ]
    };

    const chat = {
        name:"chat",
        description:"感情を持つbotちゃん",
        options: [
            {
                type: 3,
                name: "content",
                description: "会話を始めよう",
                required: true,
            },
            {
                type: 7,
                name: "channel",
                description: "チャンネル",
                required: true,
            }
        ]
    };


    const skip ={
        name:"skip",
        description:"スキップします"    
    }

    const commands = [ping,join,bye,voice,skip,chat,]

    return commands
}

/**
 * slashコマンド一覧入手
 * @params interaction
 * @params player 
 */
export async function CommandReply(interaction){

    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === 'ping') {
        await interaction.reply({ embeds: [PingEmbed ]});
    }

    if(interaction.commandName === 'join'){

        if(lockflag === true){
            interaction.reply({ embeds: [VCError1 ]});
        }else{
            connect(interaction,client,player)
            lockflag = true
        }
    }
    
    if(interaction.commandName === 'bye'){
        const connection = getVoiceConnection(interaction.guildId);
        if(connection === undefined){
            interaction.reply({ embeds: [VCError2 ]});
        }else{
            connection.disconnect();
            console.log(interaction.guildId+"のVCから退出しました")
            lockflag = false
            interaction.reply({ embeds: [DisconnectEmbed ]});
        }
    }

    if(interaction.commandName === 'voice'){
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
        if (interactionUser._roles.lastIndexOf('1097085437954240643') != -1){
            const content = interaction.options.getString('content')
            await azure_yomiage(content)
            await interaction.reply({ content: '受け付けました', ephemeral: true })
        }else{
            await interaction.reply({ content: 'このコマンドは指定されたユーザーのみが使用できます', ephemeral: true })
        }
    }

    if(interaction.commandName === 'chat'){
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
        if (interactionUser._roles.lastIndexOf('1097085437954240643')!= -1){
            const content = interaction.options.getString('content')
            const channel = interaction.options.get('channel')
            console.log(interactionUser.user.username+"が「"+channel.channel.name+"」に「"+content+"」を送信しました");
            await client.channels.cache.get(channel.channel.id).send(content);
            await interaction.reply({ content: '受け付けました', ephemeral: true })
        }else{
            await interaction.reply({ content: 'このコマンドは指定されたユーザーのみが使用できます', ephemeral: true })
        }
    }

    if(interaction.commandName === 'skip'){
        player.stop();
        await interaction.reply({ embeds: [SkipEmbed ]})
    }
}

