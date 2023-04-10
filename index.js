import { Client, GatewayIntentBits, } from "discord.js"
import axios from "axios";
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

    const ping = {
        name: "ping",
        description: "pong!",
        };

    const join = {
        name: "join",
        description: "botが入室します",
        };

    const bye ={
        name:"bye",
        description: "botを切断します",
    }

    const word ={
        name:"word",
        description: "辞書に追加します。",
        options: [
            {
              type: 3,
              name: "tango",
              description: "単語を指定します",
              required: true,
            },
            {
                type: 3,
                name: "yomi",
                description: "読み方を指定します",
                required: true,
              }
          ]
    }

    const delword ={
        name:"delword",
        description:"辞書に登録した単語を削除します。",
        options:[
            {
                type:3,
                name:"id",
                description:"登録時に発行されたIDを指定してください",
                required: true,
            }
        ]
    }

      const commands = [ping, join, bye, word, delword];

    await client.application.commands.set(commands, process.env.GuildID);

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
    if(interaction.commandName === 'word'){
        const tango = interaction.options.getString("tango")
        const yomi = interaction.options.getString("yomi")

        const rpc = axios.create({ baseURL: process.env.URL, proxy: false });
        const res = await rpc.post('user_dict_word?surface='+encodeURI(tango)+'&pronunciation='+encodeURI(yomi)+'&accent_type=0&word_type=PROPER_NOUN');
        if(res.data ===undefined){
            interaction.reply("エラーが発生しました。読み方はカタカナになっていますか？")
        }else{
            interaction.reply("辞書に登録しました。\n単語："+tango+"\n読み方："+yomi+"\n削除する際は次のIDを使用してください。\n\nID: "+res.data)
        }
    }
    if(interaction.commandName === 'delword'){
        const id = interaction.options.getString("id")
        const rpc = axios.create({ baseURL: process.env.URL, proxy: false });
        const res = await rpc.delete('user_dict_word/'+id);
        if(res.status===204){
            interaction.reply("削除しました")
        }else{
            interaction.reply("エラーが発生しました\nIDは正しく記載されていますか？\n\nできない場合は管理者に報告してください")
        }
    }
});

client.on('error', console.warn);

client.login(process.env.TOKEN);