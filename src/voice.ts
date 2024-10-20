import {
    Client,
    CommandInteraction,
    GuildMember,
    OmitPartialGroupDMChannel,
    Message} from "discord.js";

import {
    AudioPlayer,
    createAudioPlayer,
    createAudioResource,
    DiscordGatewayAdapterCreator,
    getVoiceConnection,
    joinVoiceChannel,
    PlayerSubscription,
    AudioPlayerStatus
} from "@discordjs/voice";

import axios from "axios";

export class VoiceControllerManager {
    controllerList:Array<{guildId:string,class:VoiceController}> = []

    getVoiceController(client:Client,guildId: string) {
        const voiceClass = this.controllerList.filter((controller) => controller.guildId === guildId)[0]

        if (!voiceClass) {
            return this.addVoiceController(client,guildId)
        }

        return voiceClass.class
    }

    addVoiceController(client:Client,guildId: string) {
        const voiceClass = new VoiceController(client,guildId)
        this.controllerList.push({guildId:guildId,class:voiceClass})

        return voiceClass
    }

    removeVoiceController(guildId: string) {
        this.controllerList = this.controllerList.filter((controller) => controller.guildId !== guildId)
    }
}

export class VoiceController {
    subscription: PlayerSubscription | undefined
    audioPlayer: AudioPlayer | undefined
    client: Client
    channelId: string | undefined
    guildId: string
    receiveFunction: undefined | ((data:  OmitPartialGroupDMChannel<Message<boolean>>) => Promise<void>)

    constructor(client: Client, guildId: string) {
        this.client = client
        this.guildId = guildId
        this.initHandleFunction()
    }

    initHandleFunction() {
        this.receiveFunction  = async (data: OmitPartialGroupDMChannel<Message<boolean>>) => {
            if (data.channelId == this.channelId && !data.author.bot && this.guildId == data.guildId) {
                await this.ttsPlay(data.content)
            }
        }
    }

    async join(interaction: CommandInteraction) {
        try{
            const member = interaction.member! as GuildMember

            const connection = joinVoiceChannel({
                channelId: member.voice.channelId!,
                guildId: interaction.guildId!,
                adapterCreator: interaction.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator
            })

            this.audioPlayer = createAudioPlayer();
            this.subscription = connection.subscribe(this.audioPlayer);
            this.channelId = interaction.channelId

            if (! this.receiveFunction) return
            this.client.on('messageCreate', this.receiveFunction)
            await interaction.reply('Joining the voice channel');
        }catch (e){
            await interaction.reply('エラーが発生しました');
        }
    }

    async ttsPlay(message: string) {
        try{
            const regexMessage = message.replace(/[.^$*+?()\[\]{}\\|\/]/g, '-');
            const res = await axios.get(`${process.env.TTS_API_URL}?text=${regexMessage}`,{
                headers:{
                    "Content-Type":"audio/wav"
                },
                responseType: 'stream'
            })
            const audioResource = createAudioResource(res.data)
            await this.waitUntilPlayFinish(this.audioPlayer!)
            this.audioPlayer?.play(audioResource);
        }catch (e){
            console.error(e)
        }
    }

    async waitUntilPlayFinish(player: AudioPlayer) {
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

    async bye(interaction: CommandInteraction) {
        try {
            const connection = getVoiceConnection(interaction.guild!.id);
            connection!.destroy();

            if (! this.receiveFunction) return
            this.client.off('messageCreate', this.receiveFunction)
            await interaction.reply('Leaving the voice channel');
        }catch (e){
            await interaction.reply('エラーが発生しました');
        }
    }
}
