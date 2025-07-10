import { google } from "googleapis";

function parseFormattedText(text: string) {
	if (!text) return "";

	// First, process block-level syntax that should NOT be wrapped in <p>
	let parsed = text
		// Code blocks
		.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
			`<pre class="bg-muted p-4 rounded-lg my-4"><code class="text-sm">${code}</code></pre>`
		)

		// Headers
		.replace(/^### (.*)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
		.replace(/^## (.*)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
		.replace(/^# (.*)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')

		// Blockquotes
		.replace(/^\s*>\s*(.*)$/gm, '<blockquote class="border-l-2 border-primary pl-4 italic my-4">$1</blockquote>')

		// Horizontal rule
		.replace(/^---$/gm, '<hr class="my-8 border-border" />')

		// Bold / Italic / Strike / Inline code
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
		.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
		.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
		.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')

		// Links
		.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')

		// Unordered and ordered list items
		.replace(/^\s*[-*]\s+(.*)$/gm, '<li class="ml-4">$1</li>')
		.replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-4">$1</li>')

		// Group consecutive <li> items into one <ul>
		.replace(/((<li class="ml-4">.*<\/li>\n?)+)/gm, match =>
			`<ul class="list-disc ml-6 my-2">${match.trim()}</ul>`
		);

	// Wrap remaining lines in paragraphs — only if they don't start with block tags
	parsed = parsed
		.split('\n')
		.map(line => {
			if (
				line.trim() === '' ||
				line.startsWith('<h') ||
				line.startsWith('<ul') ||
				line.startsWith('<li') ||
				line.startsWith('<blockquote') ||
				line.startsWith('<pre') ||
				line.startsWith('<hr') ||
				line.startsWith('<table') ||
				line.startsWith('<tr') ||
				line.startsWith('<td')
			) {
				return line;
			}
			return `<p class="my-2">${line}</p>`;
		})
		.join('\n');

	return parsed;
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
