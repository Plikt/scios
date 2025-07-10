import { google } from "googleapis";

function parseFormattedText(text: string) {
	if (!text) return "";
	
	return text
		// Headers
		.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
		.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
		.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
		
		// Text formatting
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>') // Bold: **text**
		.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>') // Italic: *text*
		.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>') // Strikethrough: ~~text~~
		.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>') // Inline code: `text`
		
		// Links
		.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>') // Links: [text](url)
		
		// Lists
		.replace(/^\s*[-*]\s+(.*$)/gm, '<li class="ml-4">$1</li>') // Unordered list items
		.replace(/^\s*\d+\.\s+(.*$)/gm, '<li class="ml-4">$1</li>') // Ordered list items
		.replace(/(<li.*<\/li>)\n/g, '<ul class="list-disc ml-6 my-2">$1</ul>') // Wrap unordered lists
		.replace(/(<li.*<\/li>)\n/g, '<ol class="list-decimal ml-6 my-2">$1</ol>') // Wrap ordered lists
		
		// Blockquotes
		.replace(/^\s*>\s*(.*$)/gm, '<blockquote class="border-l-2 border-primary pl-4 italic my-4">$1</blockquote>')
		
		// Code blocks
		.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg my-4"><code class="text-sm">$2</code></pre>')
		
		// Tables
		.replace(/\|(.+)\|/g, '<tr><td class="border border-border p-2">$1</td></tr>')
		.replace(/^\|(.+)\|$/gm, '<table class="border-collapse my-4"><tbody>$1</tbody></table>')
		
		// Horizontal rule
		.replace(/^---$/gm, '<hr class="my-8 border-border" />')
		
		// Line breaks
		.replace(/\n/g, '<br />')
		
		// Paragraphs
		.replace(/<br \/><br \/>/g, '</p><p class="my-2">')
		.replace(/^(.+)$/gm, '<p class="my-2">$1</p>');
}

export async function GET() {
	try {
		const auth = await google.auth.getClient({
			projectId: "scios-website",
			credentials: {
				type: "service_account",
				project_id: "scios-website",
				private_key_id: process.env.PRIVATE_KEY_ID,
				private_key: process.env.GOOGLE_PRIVATE_KEY,
				client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
				client_id: process.env.CLIENT_ID,
				token_url: process.env.TOKEN_URL,
				universe_domain: "googleapis.com",
			},
			scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
		});

		const sheets = google.sheets({ version: "v4", auth });
		const range = "Events!A2:I";
		const data = await sheets.spreadsheets.values.get({
			spreadsheetId: process.env.GOOGLE_SHEET_ID,
			range: range,
		});

		const values = data.data.values;
		const events = values?.map((value) => {
			let agenda = [];
			let oldResources = [];
			if (value[7]) {
				agenda = JSON.parse(value[7]);
			}
			if (value[6]) {
				oldResources = JSON.parse(value[6]);
			}
			return {
				title: value[0] ?? "",
				date: value[1] ?? "",
				hosts: value[2].split(",") ?? [],
				location: value[3] ?? "",
				eventLink: value[4] ?? "",
				description: parseFormattedText(value[5]) ?? "",
				oldResources,
				agenda,
				isOld: value[8],
			};
		});

		return Response.json(events);
	} catch (error) {
		console.error("Error fetching events:", error);
		return Response.json({ error: "Failed to fetch events" }, { status: 500 });
	}
}
