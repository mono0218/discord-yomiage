import { SlashCommandBuilder } from '@discordjs/builders';

import {REST, Routes} from "discord.js";

export async function commandRegister() {
    const commands = []

    commands.push(new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the voice channel')
    )

    commands.push(new SlashCommandBuilder()
        .setName('bye')
        .setDescription('Leave the voice channel')
    )

    commands.push(new SlashCommandBuilder().
        setName('ping')
        .setDescription('Replies with Pong!')
    )

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    await rest.put(
        Routes.applicationCommands(process.env.DISCORD_BOT_ID!),
        { body: [] }
    )

    await rest.put(
        Routes.applicationCommands(process.env.DISCORD_BOT_ID!),
        { body: commands }
    )
}
