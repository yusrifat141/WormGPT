export default async function handler(req, res) {
  const { systemPrompt, userMessage } = req.body || {};
  if (!userMessage)
    return res.status(400).json({ error: "User message required" });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt || "You are helpful AI." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("DEBUG OPENAI:", data);

    if (!response.ok)
      return res.status(500).json({ error: "API Error", details: data });

    let output = data.output_text?.[0];

    if (!output && data.output?.[0]?.content?.[0]?.text) {
      output = data.output[0].content[0].text;
    }

    if (!output) output = "Tidak ada respon";

    return res.status(200).json({ answer: output });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
