import OpenAI from "openai";

export default async function handler(req, res) {
  const { systemPrompt, userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "User message required" });

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt || "You are helpful AI."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.status(200).json({ 
      answer: response.output_text 
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
