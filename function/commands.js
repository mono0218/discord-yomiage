import connect from "./connection.js";
import azure_yomiage from "./yomiage.js"
import { getVoiceConnection} from "@discordjs/voice";
import { createAudioPlayer } from "@discordjs/voice";

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

    const commands = [ping,join,bye,voice,skip,chat]

    return commands
}

/**
 * slashコマンド一覧入手
 * @params interaction
 * @params player 
 */
export async function CommandReply(interaction,player,client){
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong！');
    }

    if(interaction.commandName === 'join'){
        connect(interaction,client,player)
        console.log(interaction.guildId+"のVCに入室しました。")
    }
    
    if(interaction.commandName === 'bye'){
        const connection = getVoiceConnection(interaction.guildId);
        if(connection === undefined){
            interaction.reply('vcに接続していません');
        }else{
            connection.disconnect();
            console.log(interaction.guildId+"のVCから退出しました")
            interaction.reply('bye');
        }
    }

    if(interaction.commandName === 'voice'){
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
        if (interactionUser._roles.lastIndexOf(1097085437954240643) === -1){
            const content = interaction.options.getString('content')
            await azure_yomiage(content,player)
            await interaction.reply({ content: '受け付けました', ephemeral: true })
        }else{
            await interaction.reply({ content: 'このコマンドは指定されたユーザーのみが使用できます', ephemeral: true })
        }
    }

    if(interaction.commandName === 'chat'){
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
        if (interactionUser._roles.lastIndexOf(1097085437954240643) === -1){
            const content = interaction.options.getString('content')
            const channel = interaction.options.get('channel')
            console.log(interactionUser.user.username+"が"+channel.channel.name+"に"+content+"を送信しました");
            await client.channels.cache.get(channel.channel.id).send(content);
            await interaction.reply({ content: '受け付けました', ephemeral: true })
        }else{
            await interaction.reply({ content: 'このコマンドは指定されたユーザーのみが使用できます', ephemeral: true })
        }
    }

    if(interaction.commandName === 'skip'){
        player.stop();
        await interaction.reply("スキップしました")
    }
}