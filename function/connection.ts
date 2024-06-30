import {joinVoiceChannel,getVoiceConnection, VoiceConnectionStatus,} from "@discordjs/voice"
import {CacheType, ChatInputCommandInteraction, Client, Guild, Message} from 'discord.js';
import azure_yomiage from "./yomiage.js"
import { ConnectEmbed,VCError3 } from "./Embed.js";
import { createAudioPlayer } from "@discordjs/voice";

/**
 * VCに接続
 * @params interacion
 * @params client
 * @params player
 */
export default async function connect(interaction: ChatInputCommandInteraction<CacheType>, client: Client<boolean>){
    const guild = interaction.guild as Guild;
    const member = await guild.members.fetch(interaction.member?.user.id as string)
    const member_vc = member.voice.channel

    if(!member_vc){
        await interaction.reply({ embeds: [VCError3 ]})
        return
    }

    if(!member_vc.joinable){
        await interaction.reply({ embeds: [VCError3 ]})
        return
    }
    
    const voice_channel_id = member_vc.id;
    const guild_id = guild.id;

    const connection = joinVoiceChannel({
        guildId: guild_id,
        channelId: voice_channel_id,
        adapterCreator: guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: true,
    });

    const player = createAudioPlayer();

    connection.subscribe(player);
    await interaction.reply({ embeds: [ConnectEmbed ]})
    
    console.log(interaction.guildId+"のVCに入室しました。")

    const func = async (message: Message<boolean>) => {
        const msg = {
            guild: message.guild?.id ?? null,
            channelId: message.channelId,
            content: message.content
        };
        if (msg.guild == interaction.guildId && msg.channelId == interaction.channelId){
            try {
                if(getVoiceConnection(interaction.guildId ?? '') === undefined){
                    return
                }else{
                    await azure_yomiage(msg.content, player)
                }
            } catch(e) {
                console.log(e);
            }
        }
    }
    
    client.on('messageCreate', func);

    connection.once(VoiceConnectionStatus.Disconnected, ()=>{
        client.off('messageCreate', func);
    });

    connection.once(VoiceConnectionStatus.Destroyed, ()=>{
        client.off('messageCreate', func);
    });

    return player
}