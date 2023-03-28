import {joinVoiceChannel, createAudioPlayer, createAudioResource,NoSubscriberBehavior,StreamType,getVoiceConnection} from "@discordjs/voice"
import yomiage from "./yomiage.js"

export default async function connect(interaction,client){
    const guild = interaction.guild;
    const member = await guild.members.fetch(interaction.member.id)
    const member_vc = member.voice.channel

    if(!member_vc){
        await interaction.reply({content: "vcが見つかりません"})
        return
    }

    if(!member_vc.joinable){
        await interaction.reply({content: "vcに接続できませんでした"})
        return
    }
    if(!member_vc.speakable){
        await interaction.reply({content:"権限がありません"})
        return
    }

    const voice_channel_id = member_vc.id;
    const guild_id = guild.id;

    const connectionvc = joinVoiceChannel({
        guildId: guild_id,
        channelId: voice_channel_id,
        adapterCreator: guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: true,
    });

    const player = createAudioPlayer();
    connectionvc.subscribe(player);
    const vcinteraction = interaction

    await interaction.reply({content: "接続しました"})

    client.on('messageCreate', async msg => {
        if (msg.guild == interaction.guildId && msg.channelId == interaction.channelId){
            try {
                if(getVoiceConnection(interaction.guildId)=== undefined){
    
                }else{
                    yomiage(msg,player)  
                }
            } catch(e) {
                console.log(e);
            }
        }
    });
}