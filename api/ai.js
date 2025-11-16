export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userMessage } = req.body || {};

  if (!userMessage) {
    return res.status(400).json({ error: "User message required" });
  }

  try {
    // Gabung prompt
    const mergedInput = `
SYSTEM: ${systemPrompt || "You are a helpful AI."}
USER: ${userMessage}
    `;

    // Request ke OpenAI Responses API
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",   // lu bisa ganti nanti
        input: mergedInput
      })
    });

    const data = await response.json();
    console.log("DEBUG OPENAI:", data);

    // Kalau API error
    if (!response.ok) {
      return res.status(500).json({
        error: "API Error",
        details: data
      });
    }

    // ==== FIX PALING PENTING ====
    // Format Responses API -> data.output[0].text
    const output =
      data?.output?.[0]?.text ??
      "Tidak ada respon";

    return res.status(200).json({ answer: output });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server Error",
      details: err.message
    });
  }
}
