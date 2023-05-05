import {
  Message,
  Client,
  Interaction,
  SlashCommandBuilder,
  Events,
  ChatInputCommandInteraction,
  GatewayIntentBits,
} from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Commands import

import ping from './commands/ping.js';

const discordKey = process.env.TOKEN;

/* interface */

interface Command {
  data: { name: string; description: string };
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const commands: Command[] = [ping];

client.once(Events.ClientReady, (c: Client) => {
  console.log(`Client Logged in as ${c.user?.tag}`);
  // set commands
  c.application?.commands
    .set(Array.from(commands.map((command) => command.data)))
    .then(() => {
      console.log('Commands set.');
    });
});

/* 
client.on(Events.MessageCreate, async (message: Message) => {
  // if message created, do something as below
});
*/

/* command handling */
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const commandName = interaction.commandName;
  const command = commands.find((command) => command.data.name === commandName);
  if (!command) {
    // command is not found
    return;
  }
  try {
    // execute command
    await command.execute(interaction as ChatInputCommandInteraction);
    console.log(`Command ${commandName} executed.`);
  } catch (error) {
    // error occurred
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.login(discordKey);
