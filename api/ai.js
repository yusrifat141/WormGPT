export default async function handler(req, res) {
  const { systemPrompt, userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "User message required" });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: systemPrompt || "You are helpful AI." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

    if (!response.ok) {
      return res.status(500).json({ error: "OpenAI API error", details: data });
    }

    const answer = data.output_text || "[No response]";
    res.status(200).json({ answer });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
