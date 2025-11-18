
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "User message required" });
  }

  try {
    const finalPrompt = systemPrompt + "\nUser: " + userMessage + "\nAI:";

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HF_API_KEY}`
      },
      body: JSON.stringify({
        inputs: finalPrompt,
        parameters: { max_new_tokens: 250 }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const text = data[0]?.generated_text || "";
    const answer = text.split("AI:")[1]?.trim() || text;

    return res.status(200).json({ answer });

  } catch (e) {
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}
