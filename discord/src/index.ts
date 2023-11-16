import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "../config.json"
import TelegramBot from "node-telegram-bot-api";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const tg = new TelegramBot(process.env.TG_TOKEN!!);

client.on(Events.MessageCreate, async msg => {
	if (msg.channelId != config.channel_discord)
		return;

	if (msg.author.id == "1090003488664199279") // don't send messages from itself.
		return;

	console.log(`Got message ${msg.content}`);
	const tg_msg = await tg.sendMessage(config.channel_telegram, `${msg.author.displayName}: ${msg.content}`);
});

client.once(Events.ClientReady, c => {
	console.log(`Bot on as ${c.user.tag}`);
})

client.login(process.env.DISCORD_TOKEN);