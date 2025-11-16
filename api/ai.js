import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { userMessage, systemPrompt } = req.body;
  if (!userMessage) {
    return res.status(400).json({ error: "User message missing" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini", 
      input: [
        {
          role: "system",
          content: systemPrompt || "You are an AI assistant.",
        },
        {
          role: "user",
          content: userMessage,
        }
      ]
    });

    const text = response.output_text || "No output returned";

    res.status(200).json({ reply: text });

  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
