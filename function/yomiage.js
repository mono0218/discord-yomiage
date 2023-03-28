import axios from "axios";
import fs from "fs";
import { createAudioResource,StreamType } from "@discordjs/voice";
import dotenv from "dotenv"
dotenv.config();

export default async function yomiage(msg,player){
    console.log(msg.content)
    const rpc = axios.create({ baseURL: process.env.URL, proxy: false });

    const audio_query = await rpc.post('audio_query?text=' + encodeURI(msg.content) + '&speaker=1');
    console.log("発音データを取得しました")
    const synthesis = await rpc.post("synthesis?speaker=1", JSON.stringify(audio_query.data), {
        responseType: 'stream',
        headers: {
            "accept": "audio/wav",
            "Content-Type": "application/json"
        }
    });
    console.log("合成しました")
    let resource = createAudioResource(synthesis.data, { inputType: StreamType.Arbitrary, inlineVolume: true });
    console.log(synthesis.data)
    console.log("リソースを作成しました")
    player.on('error', error => {
        console.error('Error:', error.message, );
    });
    player.play(resource);
    console.log("再生しました")
}