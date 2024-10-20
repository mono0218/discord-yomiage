import {Client, Events, GatewayIntentBits} from 'discord.js';
import { VoiceControllerManager } from "./src/voice";

// create a new Client instance
const client:Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

const voiceManager = new VoiceControllerManager()

// listen for the client to be ready
client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;
    const voiceClass = voiceManager.getVoiceController(client,interaction.guildId!)

    switch (interaction.commandName) {
        case 'ping':
            await interaction.reply('Pong!');
            break;
        case 'join':
            await voiceClass.join(interaction);
            break;
        case 'bye':
            await voiceClass.bye(interaction);
            voiceManager.removeVoiceController(interaction.guildId!)
            break;
    }
})

// login with the token from .env.local
client.login(process.env.DISCORD_TOKEN).then();
