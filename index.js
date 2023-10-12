import { Client, GatewayIntentBits, } from "discord.js"
import dotenv from "dotenv"
dotenv.config();
import { createAudioPlayer } from "@discordjs/voice";
import {commands,CommandReply} from "./function/commands.js"

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,] });


client.once('ready', async() => {
    await client.application.commands.set(commands(), process.env.GuildID);
    await client.application.commands.set(commands(),process.env.GuildID2);

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    CommandReply(interaction)
});

client.login(process.env.TOKEN);