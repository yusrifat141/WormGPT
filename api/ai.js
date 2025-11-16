// api/ai.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { systemPrompt, userMessage } = req.body;

  if (!systemPrompt || !userMessage) {
    return res.status(400).json({ error: 'systemPrompt dan userMessage wajib diisi!' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // PASTI JALAN
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.9,
      max_tokens: 1500,
    });

    const answer = completion.choices[0]?.message?.content || 'AI bengong.';

    res.status(200).json({ answer });
  } catch (error) {
    console.error('OPENAI ERROR:', error.message);
    res.status(500).json({ 
      error: 'AI gagal', 
      details: error.message 
    });
  }
}
