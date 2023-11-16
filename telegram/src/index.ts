import TelegramBot from "node-telegram-bot-api";
import { WebhookClient } from "discord.js";
import config from "../config.json"
import { get_bot_resource } from "./util";

if (process.env.TOKEN == undefined) {
	console.log("Introduce a vaild token");
	process.exit(1);
}

const bot = new TelegramBot(process.env.TOKEN, { polling: true })
const webhook = new WebhookClient({ url: config.webhook })

bot.on("message", async (msg) => {
	const pfp_ids = await bot.getUserProfilePhotos(msg.from!!.id);
	const pfp_file = await bot.getFile(pfp_ids.photos[0][0].file_id);

	let pfp;

	if (pfp_file == undefined)
		pfp == `https://source.boringavatars.com/marble/120/${msg.from?.first_name}`;
	else
		pfp = get_bot_resource(pfp_file.file_path!!)

	if (msg.sticker)
	{
		// TODO: ADD STICKER SUPPORT
		/*
		const sticker_file = await bot.getFile(msg.sticker.file_id);
		console.log(`Sticker id: ${sticker_file.file_id}\nSticker url: ${get_bot_resource(sticker_file.file_id)}`)
		webhook.send({
			username: `${msg.from?.username} (${msg.from?.id})`,
			avatarURL: pfp,
			content: get_bot_resource(sticker_file.file_id)
		})
		*/
	}
	else
	{
		webhook.send({
			content: msg.text,
			username: `${msg.from?.username} (${msg.from?.id})`,
			avatarURL: pfp,
		 })
	}
});