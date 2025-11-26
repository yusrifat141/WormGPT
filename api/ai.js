export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "User message required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://worm-gpt-green.vercel.app", // <- TANPA /
        "X-Title": "WormGPT"
      },
      body: JSON.stringify({
        model: "deepseek-r1",  // <- MODEL YANG BENAR
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(response.status).json({ error: data });
    }

    const answer = data.choices?.[0]?.message?.content || "No response";

    return res.status(200).json({ answer });

  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({ error: e.message });
  }
}
