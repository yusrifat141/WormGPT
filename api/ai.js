export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    if (!response.ok) {
      return res.status(500).json({
        error: "API Error",
        details: data
      });
    }

    // ==============================
    // FIX PROBLEM PALING PENTING !!!
    // ==============================
    let output = null;

    // Format standar Responses API
    if (data.output_text?.[0]) {
      output = data.output_text[0];
    }

    // Format baru type="message"
    else if (data.output?.[0]?.content?.[0]?.text) {
      output = data.output[0].content[0].text;
    }

    // Backup terakhir
    if (!output) output = "Tidak ada respon";

    return res.status(200).json({ answer: output });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server Error",
      details: err.message
    });
  }
}
