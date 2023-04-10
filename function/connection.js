import {joinVoiceChannel, createAudioPlayer,getVoiceConnection, VoiceConnectionStatus,} from "@discordjs/voice"
import voicevox_yomiage from "./yomiage.js"
import azure_yomiage from "./yomiage.js"

export default async function connect(interaction,client){

    let locked = false

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

    const connection = joinVoiceChannel({
        guildId: guild_id,
        channelId: voice_channel_id,
        adapterCreator: guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: true,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);
    const vcinteraction = interaction

    await interaction.reply({content: "接続しました"})

    const func = async msg => {
        if(msg.author.bot){return}
        if (msg.guild == interaction.guildId && msg.channelId == interaction.channelId){
            try {
                if(getVoiceConnection(interaction.guildId)=== undefined){
                    return
                }else{
                    await azure_yomiage(msg,player)
                }
            } catch(e) {
                console.log(e);
            }
        }
    }

    const func2 = async msg =>{
        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    }

    client.on('messageCreate', func);
    player.on('error', func2);

    connection.once(VoiceConnectionStatus.Disconnected, ()=>{
        client.off('messageCreate', func);
    });

    connection.once(VoiceConnectionStatus.Destroyed, ()=>{
        client.off('messageCreate', func);
    });

    connection.once(VoiceConnectionStatus.Destroyed, ()=>{
        player.off('error', func2);
    });

    connection.once(VoiceConnectionStatus.Disconnected, ()=>{
        player.off('error', func2);
    });

    

}