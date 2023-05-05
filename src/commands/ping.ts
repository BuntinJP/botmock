import { SlashCommandBuilder } from 'discord.js';

const ping = {
  data: new SlashCommandBuilder().setName('ping').setDescription('pong!'),
  execute: async (interaction: any) => {
    await interaction.reply('pong!');
  },
};

export default ping;
