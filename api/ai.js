import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { userMessage, systemPrompt } = req.body;
  if (!userMessage) {
    return res.status(400).json({ error: "User message required" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // sk-proj kamu
    });

    const response = await client.responses.create({
      model: "gpt-5-nano", // OpenAI asli support model ini
      input: [
        {
          role: "system",
          content: systemPrompt || "You are an AI assistant."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.status(200).json({
      reply: response.output_text,
    });

  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
