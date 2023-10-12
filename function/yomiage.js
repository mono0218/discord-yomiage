import { AudioPlayerStatus, createAudioResource, StreamType } from "@discordjs/voice";
import axios from 'axios';
import SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';

/**
 * voicevoxの読み上げ
 * @params msg
 * @returns player
 */
export async function voicevox_yomiage(msg) {
    msg = await msg_text(msg)
    const stream = await speakTextUsingVoicevox(msg);
    await AudioPlay(stream)
}

/**
 * azureの読み上げ
 * @params msg
 * @returns player
 */
export async function azure_yomiage(msg,player) {
    msg = await msg_text(msg)
    const stream = await speakTextUsingAzure(msg);
    await AudioPlay(stream,player)
}

/**
 * voicevoxを使ったオーディオデータ取得
 * @params String
 * @returns AudioData
 */
async function speakTextUsingVoicevox(msg) {
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

/**
 * 文字列の修正
 * 
 * @returns msg
 */
async function msg_text(msg){
    if(msg.indexOf('<') != -1){
        console.log(msg)
        msg = msg.replace(/[0-9０-９]/g, ' ').replace('<',' ').replace(':',' ').replace('>',' ')
    }

    if(msg.indexOf('http') != -1){
        msg = "URL"
    }

    if (msg.indexOf('.') != -1) {
        msg=""
    }
    return msg
}

/**
 * azureの読み上げ設定を取得
 * 
 * @returns speechConfig
 */
async function AzureSettings(){
    const keyText = process.env.AZURE_API;
    const regionText = "japaneast";
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(keyText, regionText);
    speechConfig.speechSynthesisLanguage = "ja-JP";
    speechConfig.speechSynthesisVoiceName = "ja-JP-AoiNeural";
    return speechConfig
}

/**
 * azureの読み上げオーディオデータ取得
 * @params String
 * @returns AudioData
 */
async function speakTextUsingAzure(msg) {
    const synthesizer = new SpeechSDK.SpeechSynthesizer(await AzureSettings());
    let result;
    try {
        result = await new Promise((resolve, reject) => {
            console.log("[ " + msg + " ]" + "===> AZURE API");
            synthesizer.speakTextAsync(msg, resolve, reject);
        });
    }
    finally {
        synthesizer.close();
    }
    return new PassThrough().end(Buffer.from(result.audioData));
}

/**
 * 読み上げが終わるまで待機する
 */
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

/**
 * 音声データの再生
 * @params stream
 * @params player
 */
async function AudioPlay(stream,player){
    let resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
    await waitUntilPlayFinish(player);
    player.play(resource);
}

export default azure_yomiage;