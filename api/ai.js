export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { systemPrompt, userMessage } = req.body;

    const finalPrompt = `${systemPrompt}\nUser: ${userMessage}`;

    const response = await fetch(process.env.MODEL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: finalPrompt })
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API Error: ${response.status}`
      });
    }

    const result = await response.json();

    return res.status(200).json({
      answer: result.output || result.answer || result.text || "AI tidak merespons"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server Error: " + err.message
    });
  }
}
