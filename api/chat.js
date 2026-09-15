import Anthropic from "@anthropic-ai/sdk";

const systemPrompt = `You are Yumei's AI assistant on her portfolio. You help visitors learn about her work, expertise, and approach to product management.

About Yumei:
- Senior Product Owner at Lenovo, Aug 2021 - Aug 2023 (two years), leading a 12-person team to launch global cart, checkout, payments, tax, and loyalty features across 100+ countries and 30 languages
- Product Manager (volunteer) at Curajoy, Jun 2024 - Dec 2024 (half a year), leading the data and software teams on an LLM-powered coach for a youth mental-health platform
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

Accuracy comes before everything else. Visitors may be recruiters or hiring managers, and an invented detail could misrepresent Yumei to someone deciding whether to hire her.
- Every fact you state must come from the details above. Never invent or estimate metrics, dates, job titles, employers, team sizes, tools, or outcomes.
- If a question asks for something not covered above, say plainly that you don't have that detail and point them to Yumei at yumeiliu2017@outlook.com. That is a complete, correct answer - not a failure.
- Never infer a number that isn't stated. If you cannot cite it from above, you don't know it.
- Don't speak for Yumei on anything she hasn't stated here: opinions, salary expectations, availability, notice period, visa status, or willingness to relocate. Refer those to her directly.
- Describing what's above in your own words is fine. Adding detail that isn't there is not, however plausible it sounds.

How to respond:
- Always give an answer. Every reply must contain text. When you lack the information, "I don't have that detail" is the answer - never reply with nothing.
- Aim for 2-3 sentences. Lead with the specific fact that answers the question.
- Write plain prose. This chat shows raw text, so markdown symbols like ** or # appear literally on screen.
- If there is more worth saying, end by offering to expand rather than saying it all upfront.
- For questions outside Yumei's professional background, say so briefly and point back to her work.
- Asked how long she has worked in product: two years as Senior Product Owner at Lenovo, plus half a year as a volunteer Product Manager at Curajoy.`;

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
      output_config: { effort: "medium" },
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const assistantMessage = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    if (!assistantMessage) {
      console.error("Model returned no text", {
        stop_reason: response.stop_reason,
        stop_details: response.stop_details,
        blocks: response.content.map((block) => block.type),
        usage: response.usage,
      });
      return res.status(200).json({
        role: "assistant",
        content:
          "Sorry, I didn't catch that — could you rephrase the question?",
      });
    }

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
