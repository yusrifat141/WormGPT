export default async function handler(req, res) {
  if(req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userMessage } = req.body;
  if(!userMessage) return res.status(400).json({ error: "User message required" });

  try {
    // Logic API: buat jawaban random
    const answers = [
      "Hmm, menarik sekali!",
      "Aku paham maksudmu.",
      "Bisa jelaskan lebih detail?",
      "Wah, itu ide bagus!"
    ];

    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
    const answer = `AI (${systemPrompt || "default"}): ${randomAnswer}`;

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
