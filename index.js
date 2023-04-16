import { Client, GatewayIntentBits, } from "discord.js"
import dotenv from "dotenv"
dotenv.config();
import { createAudioPlayer } from "@discordjs/voice";
import {commands,CommandReply} from "./function/commands.js"

process.on('uncaughtException', (err) => {
    err = err instanceof Error ? err : new Error(`uncaughtException ${err}`);
    logger.error(err.stack + util.inspect(err, {depth: null, colors: true}));
    logger.error("エラーが発生しましたが実行を継続します");
});

// 終了処理
for (let signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
    process.on(signal, async () => {
        if (this.isClosing) return;
        this.isClosing = true;
        await this.close();
        process.exit(0);
    });
}

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