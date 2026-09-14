import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function loadDocumentsContext() {
  try {
    const docsDir = path.join(process.cwd(), "documents");
    const configPath = path.join(docsDir, "config.json");

    if (!fs.existsSync(configPath)) {
      console.warn("Config file not found");
      return "";
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    let documentsContent = "";

    if (config.documentsToInclude && Array.isArray(config.documentsToInclude)) {
      config.documentsToInclude.forEach((docName) => {
        const docPath = path.join(docsDir, docName);
        if (fs.existsSync(docPath)) {
          const content = fs.readFileSync(docPath, "utf-8");
          documentsContent += `\n\n--- ${docName} ---\n${content}`;
        }
      });
    }

    return documentsContent;
  } catch (error) {
    console.error("Error loading documents:", error);
    return "";
  }
}

function buildSystemPrompt() {
  const documentsContext = loadDocumentsContext();

  return `You are Yumei's AI assistant on her portfolio. You help visitors learn about her work, expertise, and approach to product management.

You have access to the following detailed information about Yumei from her documents:

${documentsContext}

Keep responses concise, friendly, and reference specific details from her documents when relevant. If someone asks about something not related to Yumei's work or portfolio, politely redirect them back to her professional work.`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res
      .status(500)
      .json({ error: "API key not configured on server" });
  }

  try {
    const systemPrompt = buildSystemPrompt();

    const response = await client.messages.create({
      model: "claude-opus-4-1",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    return res.status(200).json({
      role: "assistant",
      content: assistantMessage,
    });
  } catch (error) {
    console.error("Claude API error:", error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
}
