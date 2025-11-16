import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { systemPrompt, userMessage } = req.body;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    res.status(200).json({
      answer: response.output_text || "[No response]"
    });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
