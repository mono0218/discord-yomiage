import { AudioPlayer, AudioPlayerStatus, createAudioResource, StreamType } from "@discordjs/voice";
import SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough, Readable } from 'stream';

/**
 * azureの読み上げ
 * @params msg
 * @returns player
 */
export async function azure_yomiage(msg: string, player: AudioPlayer) {
    msg = await msg_text(msg)
    const stream = await speakTextUsingAzure(msg);
    await AudioPlay(stream,player)
}

/**
 * 文字列の修正
 * 
 * @returns msg
 */
async function msg_text(msg:string){
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
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(keyText || "", regionText);
    speechConfig.speechSynthesisLanguage = "ja-JP";
    speechConfig.speechSynthesisVoiceName = "ja-JP-AoiNeural";
    return speechConfig
}

/**
 * azureの読み上げオーディオデータ取得
 * @params String
 * @returns AudioData
 */
async function speakTextUsingAzure(msg:string) {
    const synthesizer = new SpeechSDK.SpeechSynthesizer(await AzureSettings());
    let result: any;
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
async function waitUntilPlayFinish(player: AudioPlayer) {
    return new Promise<void>((resolve, _) => {
        if (player.state.status == AudioPlayerStatus.Idle) {
            return resolve();
        }
        //@ts-ignore
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
async function AudioPlay(stream: string | Readable,player: AudioPlayer){
    let resource = createAudioResource(stream, {metadata: undefined, inputType: StreamType.Arbitrary, inlineVolume: true });
    await waitUntilPlayFinish(player);
    player.play(resource);
}

export default azure_yomiage;