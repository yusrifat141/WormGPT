export default async function handler(req, res) {
  try {
    const { systemPrompt, userMessage } = req.body || {};

    if (!userMessage) {
      return res.status(400).json({ error: "User message required" });
    }

    const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AIML_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("AIMLAPI DEBUG:", data);

    if (!response.ok) {
      return res.status(500).json({ error: "API Error", details: data });
    }

    const answer =
      data?.choices?.[0]?.message?.content || "Tidak ada respon dari AIMLAPI";

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
