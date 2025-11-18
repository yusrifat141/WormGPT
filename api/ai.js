export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "User message required" });
  }

  try {
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: userMessage });

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-R1",
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const answer = data.choices?.[0]?.message?.content || "[No response]";

    return res.status(200).json({ answer });
    
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
