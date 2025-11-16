import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { systemPrompt, userMessage } = req.body;

  if (!systemPrompt || !userMessage) {
    res.status(400).json({ error: 'systemPrompt dan userMessage wajib diisi!' });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Ganti ke 'gpt-4o' atau 'gpt-3.5-turbo' kalau mau
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.9,
      max_tokens: 1500,
    });

    const answer = completion.choices[0]?.message?.content || 'AI bengong, coba lagi.';

    res.status(200).json({ answer });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({ 
      error: 'AI gagal nyanyi', 
      details: error.message 
    });
  }
}
