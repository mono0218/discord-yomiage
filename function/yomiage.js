import axios from "axios";
import { AudioPlayerStatus, createAudioResource,StreamType } from "@discordjs/voice";
import dotenv from "dotenv"
import SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import fs from "fs";
import PassThrough from "stream"
dotenv.config();

export async function voicevox_yomiage(msg,player){

    const rpc = axios.create({ baseURL: process.env.URL, proxy: false });
    var result = msg.content.indexOf('http');
    if(result !== -1){
        msg.content = "URL"
    }

    const audio_query = await rpc.post('audio_query?text=' + encodeURI(msg.content) + '&speaker=1');
    console.log("[ "+msg.content+" ]"+"===> VOICEVOX API")

    audio_query.speedScale = "100"

    const synthesis = await rpc.post("synthesis?speaker=1", JSON.stringify(audio_query.data), {
        responseType: 'stream',
        headers: {
            "accept": "audio/wav",
            "Content-Type": "application/json"
        }
    });

    let resource = createAudioResource(synthesis.data, { inputType: StreamType.Arbitrary, inlineVolume: true });
    await waitUntilPlayFinish(player)
    player.play(resource);

    player.once('error', error => {
        console.error('Error:', error.message, );
    });
}

export default async function azure_yomiage(msg,player) {
    const keyText = process.env.AZURE_API
    const regionText = "japaneast"
    let speechConfig = SpeechSDK.SpeechConfig.fromSubscription(keyText, regionText);
    speechConfig.speechSynthesisLanguage = "ja-JP";
    speechConfig.speechSynthesisVoiceName = "ja-JP-NanamiNeural";
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    const post = async()=>{
        return new Promise((resolve, reject) => {
            synthesizer.speakTextAsync(
                msg,
                result => {
                    synthesizer.close();
                        console.dir(result)
                        console.dir(resutl.audioData)
                    // return stream from memory
                    const bufferStream = new PassThrough();
                    bufferStream.end(Buffer.from(result.audioData));
                    const readableStream = new Blob([bufferStream]).stream();
                    resolve(readableStream);
                },
                error => {
                    synthesizer.close();
                    reject(error);
            }); 
        });
    }

    let resource = createAudioResource(await post(), { inputType: StreamType.Arbitrary, inlineVolume: true });
    await waitUntilPlayFinish(player);
    player.play(resource);

    console.log("再生しました");
}

async function waitUntilPlayFinish(player) {
        return new Promise((resolve, reject) => {
            if (player.state.status == AudioPlayerStatus.Idle) {
                return resolve();
            }
            this.player.once(AudioPlayerStatus.Idle, () => {
                resolve();
            });
        })
    
}

function promisify(fn) {
    return (arg0) => {
        return new Promise((resolve, reject) => {
            fn(arg0, resolve, reject);
        });
    };
}