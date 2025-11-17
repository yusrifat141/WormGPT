export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "User message required" });
  }

  try {
    const prompt = (systemPrompt || "") + "\n" + userMessage;

    const response = await fetch("https://platform.deepseek.com/api/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const answer = data.output_text || "[No response]";

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
