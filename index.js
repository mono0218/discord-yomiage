import json from "./config.json" assert { type: "json" }
import { Client, GatewayIntentBits, } from "discord.js"
import connect from "./function/connection.js";
import { getVoiceConnection,createAudioPlayer } from "@discordjs/voice";
import yomiage from "./function/yomiage.js"

const token =json.token 

const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,] });

client.once('ready', async() => {
    const data = [{
        name: "ping",
        description: "pongと返信します。",
        name:"join",
        description: "ボイスチャットに接続します",
        name:"bye",
        description:"ボイスチャットから切断します",
    }];
    await client.application.commands.set(data, '911457453475004438');

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
        connect(interaction,client)
    }
    
    if(interaction.commandName === 'bye'){
        const connection = getVoiceConnection(interaction.guildId);
        if(connection === undefined){
            interaction.reply('vcに接続していません');
        }else{
            connection.destroy();
            interaction.reply('bye');
        }
    }
});


client.on('error', console.warn);

client.login(token);