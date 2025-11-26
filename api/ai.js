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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost",   // wajib
        "X-Title": "My App"                   // bebas isinya
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          { role: "system", content: systemPrompt || "" },
          { role: "user", content: userMessage }
        ]
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
