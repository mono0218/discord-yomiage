import { Client, GatewayIntentBits, } from "discord.js"
import dotenv from "dotenv"
dotenv.config();

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,] });


client.once('ready', async() => {
    await client.application.commands.set([],"1251571757748326431");
    console.log("処理が完了しました")
});

client.login(process.env.TOKEN);