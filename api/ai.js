export default async function handler(req, res) {
  const { systemPrompt, userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "User message required" });

  try {
    const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt || "You are a helpful AI." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("AIMLAPI response:", data);

    if (!response.ok) return res.status(500).json({ error: "AIMLAPI error", details: data });
    res.status(200).json({ answer: data.choices?.[0]?.message?.content || "[No response]" });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
