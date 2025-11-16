export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { systemPrompt, userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: "User prompt required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt || "" },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ answer: data.choices?.[0]?.message?.content || "" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
