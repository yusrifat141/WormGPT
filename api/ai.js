export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "User message required" });
  }

  try {
    const prompt = (systemPrompt || "") + "\n" + userMessage;

    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HF_API_KEY}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 200 }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ answer: data[0]?.generated_text || "[No response]" });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
