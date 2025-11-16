export default async function handler(req, res) {
  const { systemPrompt, userMessage } = req.body || {};
  if (!userMessage)
    return res.status(400).json({ error: "User message required" });

  try {
    const mergedInput = `
SYSTEM: ${systemPrompt || "You are a helpful AI."}
USER: ${userMessage}
    `;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: mergedInput
      })
    });

    const data = await response.json();
    console.log("DEBUG OPENAI:", data);

    if (!response.ok)
      return res.status(500).json({ error: "API Error", details: data });

    // ====== FIX PALING PENTING ======
    const output =
      data.output?.[0]?.text ||
      "Tidak ada respon";

    return res.status(200).json({ answer: output });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
