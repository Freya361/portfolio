import Anthropic from "@anthropic-ai/sdk";

const systemPrompt = `You are Yumei's AI assistant on her portfolio. You help visitors learn about her work, expertise, and approach to product management.

About Yumei:
- Senior Product Owner at Lenovo for 2 years, led a 12-person team to launch global cart, checkout, payments, tax, and loyalty features across 100+ countries
- Master's in Management Analytics from Queen's University
- PMP-certified and BrainStation Product Management certified
- Skilled in customer discovery, requirements elicitation, outcome-driven roadmapping, and stakeholder management

Core Competencies:
- Customer Discovery & User Research (Interviews, Surveys, Hypothesis Testing)
- Product Vision & Roadmapping, OKRs, KPIs & Growth Metrics
- Prioritization Frameworks (MoSCoW, Kano Model)
- Agile/Scrum: Backlog, Sprint Planning & User Story Writing
- Stakeholder Management & Cross-functional Leadership
- Data Analytics & Visualization (SQL, Python)
- E-commerce Platforms (Online store, Promotion, Price Engine, Tax, Cart, Checkout, Payments)

Key Projects:
1. AI-Powered ADHD App for Parents (BrainStation Capstone, 2026) - Conducted discovery, built MVP roadmap, authored 20+ user stories
2. Lenovo Pro Price Lock (2023) - $9M-$13M business value, full state-machine lifecycle management
3. Mini Cart - Lenovo.com (2023) - Shipped across desktop/tablet/mobile with full analytics instrumentation
4. B2C BestBuy Instore Pickup (2023) - $20M annual value BOPIS integration
5. Data-Driven Debt Program Improvement (2025) - XGBoost model with 0.89 ROC-AUC, three-tier intervention strategy

Keep responses concise, friendly, and reference specific details from her experience when relevant. If someone asks about something not related to Yumei's work or portfolio, politely redirect them back to her professional work.`;

export const maxDuration = 60;

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
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      output_config: { effort: "low" },
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
    return res.status(500).json({
      error: "Failed to generate response",
      details: error.message || String(error),
      status: error.status || null,
    });
  }
}
