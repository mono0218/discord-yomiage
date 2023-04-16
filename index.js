import { Client, GatewayIntentBits, } from "discord.js"
import dotenv from "dotenv"
dotenv.config();
import { createAudioPlayer } from "@discordjs/voice";
import {commands,CommandReply} from "./function/commands.js"

const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,] });

client.once('ready', async() => {
    await client.application.commands.set(commands(), process.env.GuildID);
    console.log(`Logged in as ${client.user.tag}!`);
});

const player = createAudioPlayer();

client.on("interactionCreate", async (interaction) => {
    CommandReply(interaction,player,client)
});

client.on('error', console.warn);

client.login(process.env.TOKEN);