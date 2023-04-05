import { Client, GatewayIntentBits, } from "discord.js"
import dotenv from "dotenv"
dotenv.config();

import connect from "./function/connection.js";
import { getVoiceConnection,createAudioPlayer } from "@discordjs/voice";

const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,] });

client.once('ready', async() => {
    const data = [];
    await client.application.commands.set(data);
    await console.log("delete success")
});

client.login(process.env.TOKEN);