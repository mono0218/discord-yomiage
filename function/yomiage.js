import axios from "axios";
import fs from "fs";
import { createAudioResource,StreamType } from "@discordjs/voice";
import dotenv from "dotenv"
dotenv.config();

export default async function yomiage(msg,player){
    console.log(msg.content)
    const rpc = axios.create({ baseURL: process.env.URL, proxy: false });

    const audio_query = await rpc.post('audio_query?text=' + encodeURI(msg.content) + '&speaker=1');
    const synthesis = await rpc.post("synthesis?speaker=1", JSON.stringify(audio_query.data), {
        responseType: 'arraybuffer',
        headers: {
            "accept": "audio/wav",
            "Content-Type": "application/json"
        }
    });

    let resource = createAudioResource(Buffer.from(synthesis.data), { inputType: StreamType.Arbitrary, inlineVolume: true });
    player.on('error', error => {
        console.error('Error:', error.message, );
    });
    player.play(resource);
}