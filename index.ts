import { CacheType, ChatInputCommandInteraction, Client, GatewayIntentBits, Interaction } from "discord.js";
import dotenv from "dotenv"
dotenv.config();

import {commands} from "./function/commandRegister.js"
import {CommandInteractionClass} from "./function/commands.js";

const client:Client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,] });


client.once('ready', async() => {
    if (client.application && process.env.GuildID) {
        await client.application.commands.set(commands(), process.env.GuildID);
    }else{
        throw new Error("env not ")
    }

    console.log(`Logged in as ${client.user?.tag}!`);
});

let guildList:{id:string,interactionClass:CommandInteractionClass}[] = []

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
    if (!interaction.isCommand()) return;
    let guild = guildList.filter(client => client.id === interaction.guildId)[0]

    if (!guild){
        guild = {id:interaction.guildId as string,interactionClass:new CommandInteractionClass(client)}
        guildList.push(guild)
    }

    await guild.interactionClass.switchReply(interaction as ChatInputCommandInteraction<CacheType>)
});

client.login(process.env.TOKEN).then();