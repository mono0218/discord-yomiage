const {token} = require("./config.json")
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource,NoSubscriberBehavior } = require('@discordjs/voice');
const { default: axios } = require("axios");
const fs = require("fs");


const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,] });

client.once('ready', async() => {
    const data = [{
        name: "ping",
        description: "pongと返信します。",
        name:"join",
        description: "ボイスチャットに接続します",
        name:"bye",
        description:"ボイスチャットから切断します",
    }];
    await client.application.commands.set(data, '1089544171435597878');

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong！');
    }

    if(interaction.commandName === 'join'){
        connect(interaction);
    }
});


async function connect(interaction){
    const guild = interaction.guild;
    const member = await guild.members.fetch(interaction.member.id)
    const member_vc = member.voice.channel

    if(!member_vc){
        await interaction.reply({content: "接続先のチャンネルが見つかりません"})
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

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    await interaction.reply({content: "接続しました"})

    client.on('messageCreate', async msg => {
        if (msg.guild == "1089544171435597878" && msg.channelId == "1089545060418330704"){
            try {
                console.log(msg.content)
                genAudio(msg.content,"voice/test.wav")

                const resource = createAudioResource('voice/test.wav');
                player.play(resource);
    
            } catch(e) {
                console.log(e);
            }
        }
    });
}

const rpc = axios.create({ baseURL: "http://0.0.0.0:50021", proxy: false });

async function genAudio(text, filepath) {

    const audio_query = await rpc.post('audio_query?text=' + encodeURI(text) + '&speaker=1');

    const synthesis = await rpc.post("synthesis?speaker=1", JSON.stringify(audio_query.data), {
        responseType: 'arraybuffer',
        headers: {
            "accept": "audio/wav",
            "Content-Type": "application/json"
        }
    });

    fs.writeFileSync(filepath, new Buffer.from(synthesis.data), 'binary');
}

client.on('error', console.warn);

client.login(token);