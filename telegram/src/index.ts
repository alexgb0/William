import TelegramBot from "node-telegram-bot-api";
import { WebhookClient, EmbedBuilder } from "discord.js";
import config from "../config.json"
import { get_bot_resource } from "./util";
import { $ } from "bun";

if (process.env.TOKEN == undefined) {
	console.log("Introduce a vaild token");
	process.exit(1);
}

const bot = new TelegramBot(process.env.TOKEN, { polling: true })
const webhook = new WebhookClient({ url: config.webhook })

bot.on("message", async (msg) => {
	let pfp;
	const pfp_ids = await bot.getUserProfilePhotos(msg.from!!.id);
	if (pfp_ids.total_count == 0)
		pfp == `https://source.boringavatars.com/marble/120/${msg.from?.first_name}`;
	else {
		const pfp_file = await bot.getFile(pfp_ids.photos[0][0].file_id);
		pfp = get_bot_resource(pfp_file.file_path!!)
	}


	if (msg.photo) {
		let len = msg.photo.length;
		if (len == undefined) len = 0;
		const photo_file_path = await bot.downloadFile(msg.photo[len-1].file_id, config.temp_dir);
		const file_url = await $`curl -F'file=@${photo_file_path}' https://0x0.st`.text()
		console.log(`photo uploaded: ${file_url}`)

		const embed = new EmbedBuilder()
			.setImage(file_url);
		
		if (msg.caption != undefined)
			embed.setDescription(msg.caption);

		webhook.send({
			embeds: [embed],
			username: `${msg.from?.username} (${msg.from?.id})`,
			avatarURL: pfp,
		})

		await Bun.file(photo_file_path).delete();

		return;
	}

	if (msg.reply_to_message) {
		const text = `[replying to: ${msg.reply_to_message.from?.username}]\n> ${msg.reply_to_message.text}\n${msg.text}`
		webhook.send({
			content: text,
			username: `${msg.from?.username} (${msg.from?.id})`,
			avatarURL: pfp,
		})

		return;
	}

	if (msg.sticker) {
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

	if (msg.from?.id == 6789015514) // bots id
		return;

	if (msg.text == undefined || msg.text == "" || msg.text?.length == 0)
		return;

	webhook.send({
		content: msg.text,
		username: `${msg.from?.username} (${msg.from?.id})`,
		avatarURL: pfp,
	})
});