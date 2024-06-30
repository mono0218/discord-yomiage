import { EmbedBuilder } from 'discord.js';

export const ConnectEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("接続したよ！よろしくね！")

export const DisconnectEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("切断したよ！また使ってね！")

export const VCError1 = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("既に接続しているよ！エラーが発生した場合は管理者を呼んでね")

export const VCError2 = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("切断できなかったよ！エラーが発生した場合は管理者を呼んでね")

export const VCError3 = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("権限がないよ！サーバー管理者に連絡してね")

export const SkipEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("VCに接続していないよ！VCに接続してから試してね！\nエラーが発生した場合は管理者を呼んでね")

export const PingEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("接続は良好だよ！きゅうもちゃんも元気！")