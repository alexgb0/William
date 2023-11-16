import { Client, Events, GatewayIntentBits, MessageMentions } from "discord.js";
import config from "../config.json"
import TelegramBot from "node-telegram-bot-api";
import { get_user_from_mention } from "./utils";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const tg = new TelegramBot(process.env.TG_TOKEN!!);

client.on(Events.MessageCreate, async msg => {
	if (msg.channelId != config.channel_discord)
		return;

	if (msg.author.id == "1090003488664199279") // don't send messages to itself.
		return;

	const mentions = get_user_from_mention(msg.content);
	if (!mentions) {
		await tg.sendMessage(config.channel_telegram, `${msg.author.displayName}: ${msg.content}`);
		return;
	}

	const msg_cpy = msg.content;
	const match = msg_cpy.match(MessageMentions.UsersPattern)!![0]

	if (!match) return; // this should never happen.

	const parsed_id = match.substring(2, match.length - 1);
	const parsed_contents = msg.content.replace(MessageMentions.UsersPattern, "@" + client.users.cache.get(parsed_id)?.displayName!!);
	await tg.sendMessage(config.channel_telegram, `${msg.author.displayName}: ${parsed_contents}`)
});

client.once(Events.ClientReady, c => {
	console.log(`Bot on as ${c.user.tag}`);
})

client.login(process.env.DISCORD_TOKEN);