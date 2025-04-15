export function get_bot_resource(id: number | string): string
{
	return `https://api.telegram.org/file/bot${process.env.TOKEN}/${id}`
}

