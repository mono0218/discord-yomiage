import { AudioPlayerStatus, createAudioResource, StreamType } from "@discordjs/voice";
import axios from 'axios';
import SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';
export async function voicevox_yomiage(msg, player) {
    var result = msg.content.indexOf('http');
    if(result !== -1){
        msg.content = "URL"
    }
    const stream = await speakTextUsingVoicevox(msg);
    let resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
    await waitUntilPlayFinish(player);
    player.play(resource);
    console.log("再生しました");
}

export async function speakTextUsingVoicevox(msg) {
    const rpc = axios.create({ baseURL: process.env.URL, proxy: false });
    const audio_query = await rpc.post('audio_query', {}, {
        params: {
            text: msg,
            speaker: 1,
        }
    });
    console.log("[ " + msg + " ]" + "===> VOICEVOX API");
    let requestBody = {
        ...audio_query.data,
        speedScale: 1.0,
    };
    const synthesis = await rpc.post("synthesis", requestBody, {
        responseType: 'stream',
        headers: {
            "Accept": "audio/wav",
            "Content-Type": "application/json"
        },
        params: {
            speaker: 1,
        }
    });
    return synthesis.data;
}

export async function azure_yomiage(msg, player) {
    
    if(msg.indexOf('http') != -1){
        msg = "URL"
    }

    if (msg.indexOf('.') != -1) {
        return
    }
    const stream = await speakTextUsingAzure(msg);
    let resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
    await waitUntilPlayFinish(player);
    player.play(resource);
}

export async function speakTextUsingAzure(msg) {
    const keyText = process.env.AZURE_API;
    const regionText = "japaneast";
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(keyText, regionText);
    speechConfig.speechSynthesisLanguage = "ja-JP";
    speechConfig.speechSynthesisVoiceName = "ja-JP-NanamiNeural";
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    let result;
    try {
        result = await new Promise((resolve, reject) => {
            synthesizer.speakTextAsync(msg, resolve, reject);
        });
    }
    finally {
        synthesizer.close();
    }
    return new PassThrough().end(Buffer.from(result.audioData));
}

async function waitUntilPlayFinish(player) {
    return new Promise((resolve, _) => {
        if (player.state.status == AudioPlayerStatus.Idle) {
            return resolve();
        }
        player.once(AudioPlayerStatus.Idle, () => {
            resolve();
        });
    });
}
export default azure_yomiage;