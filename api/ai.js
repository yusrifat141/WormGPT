export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "User message required" });
  }

  try {
    
    const messages = [
      { role: "system", content: systemPrompt || "" },
      { role: "user", content: userMessage }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    let answer = data.choices?.[0]?.message?.content || "[No response]";

    answer = answer.replace(/<p>\s*<\/p>/g, "").replace(/<p>\s*\.\s*<\/p>/g, "").trim();

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
