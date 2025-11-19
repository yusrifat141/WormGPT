export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { systemPrompt, userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "User message required" });
    }

    const prompt = (systemPrompt || "") + "\n" + userMessage;

    const response = await fetch(`${process.env.MODEL_API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ answer: data.response });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
