import { MessageMentions } from "discord.js";

export function get_user_from_mention(mention: string): boolean
{
	return MessageMentions.UsersPattern.test(mention)
}
