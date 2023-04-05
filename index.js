import { Client, GatewayIntentBits, } from "discord.js"
import dotenv from "dotenv"
dotenv.config();

import connect from "./function/connection.js";
import { getVoiceConnection,createAudioPlayer } from "@discordjs/voice";
import yomiage from "./function/yomiage.js"

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
    await client.application.commands.set(data, process.env.GuildID);

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
});

client.on('error', console.warn);

client.login(process.env.TOKEN);