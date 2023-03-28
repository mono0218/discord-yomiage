import axios from "axios";
import fs from "fs";
import { createAudioResource } from "@discordjs/voice";
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

    fs.writeFileSync("voice/test.wav", new Buffer.from(synthesis.data), 'binary');

    let resource = createAudioResource("voice/test.wav");
    player.on('error', error => {
        console.error('Error:', error.message, );
    });
    player.play(resource);
}