import connect from "./connection.js";
import azure_yomiage from "./yomiage.js"
import {AudioPlayer, getVoiceConnection} from "@discordjs/voice";
import {DisconnectEmbed, PingEmbed, SkipEmbed, VCError1, VCError2} from "./Embed.js"
import { CacheType, Channel, ChatInputCommandInteraction, Client, CommandInteraction, Guild, TextChannel } from "discord.js";

/**
 * slashコマンド一覧入手
 * @params interaction
 * @params player 
 */

export class CommandInteractionClass{
    player:AudioPlayer | undefined
    client:Client

    constructor(client:Client) {
        this.player = undefined
        this.client = client
    }

    async switchReply(interaction: ChatInputCommandInteraction<CacheType>){
        switch (interaction.commandName){
            case 'ping':
                await this.replyPing(interaction)
                break
            case 'join':
                await this.replyJoin(interaction)
                break
            case 'bye':
                await this.replyBye(interaction)
                break
            case 'voice':
                await this.replyVoice(interaction)
                break
            case 'chat':
                await this.replyChat(interaction)
                break
            case 'skip':
                await this.replySkip(interaction)
                break
        }
    }

    private async replyPing(interaction: ChatInputCommandInteraction<CacheType>){
        if (interaction.commandName === 'ping') {
            await interaction.reply({ embeds: [PingEmbed]});
        }
    }

    private async replyJoin(interaction: ChatInputCommandInteraction<CacheType>){
        if(interaction.commandName === 'join'){
            const connection = getVoiceConnection(interaction.guildId as string);

            if(connection != undefined){
                await interaction.reply({ embeds: [VCError1]});
            }else{
                this.player = await connect(interaction, this.client)
            }
        }
    }

    private async replyBye(interaction: ChatInputCommandInteraction<CacheType>){
        if(interaction.commandName === 'bye'){
            const connection = getVoiceConnection(interaction.guildId as string);

            if(connection === undefined){
                await interaction.reply({ embeds: [VCError2]});
            }else{
                connection.destroy()
                console.log(interaction.guildId+"のVCから退出しました")
                await interaction.reply({ embeds: [DisconnectEmbed ]});
            }
        }
    }

    private async replyVoice(interaction: ChatInputCommandInteraction<CacheType>){
        if(interaction.commandName === 'voice'){
            const guild = interaction.guild as Guild
            const interactionUser = await guild.members.fetch(interaction.user.id)

            if (interactionUser.roles.cache.has('1097085437954240643')){
                const content = interaction.options.getString('content') as string

                if(this.player === undefined){
                    await interaction.reply({ embeds: [VCError2]});
                    return
                }
                
                await azure_yomiage(content,this.player)
                await interaction.reply({ content: '受け付けました', ephemeral: true })
            }else{
                await interaction.reply({ content: 'このコマンドは指定されたユーザーのみが使用できます', ephemeral: true })
            }
        }
    }

    private  async replyChat(interaction: ChatInputCommandInteraction<CacheType>){
        if(interaction.commandName === 'chat'){
            const guild = interaction.guild as Guild
            const interactionUser = await guild.members.fetch(interaction.user.id)

            if (interactionUser.roles.cache.has('1097085437954240643')){
                const content = interaction.options.getString('content')
                const inputInteraction = interaction.options.get('channel') as unknown as CommandInteraction<CacheType>
                const channel:Channel = inputInteraction.channel as Channel

                console.log(interactionUser.user.username+"が「"+(channel.fetch.name)+"」に「"+content+"」を送信しました");

                const sendChannel = await this.client.channels.cache.get(channel.id) as TextChannel
                await sendChannel.send(content!)

                await interaction.reply({ content: '受け付けました', ephemeral: true })
            }else{
                await interaction.reply({ content: 'このコマンドは指定されたユーザーのみが使用できます', ephemeral: true })
            }
        }
    }

    private async replySkip(interaction: ChatInputCommandInteraction<CacheType>){
        if(interaction.commandName === 'skip'){
            if(this.player === undefined){
                await interaction.reply({ embeds: [VCError2]});
             
                return
            }

            this.player.stop();
            await interaction.reply({ embeds: [SkipEmbed ]})
        }
    }
}