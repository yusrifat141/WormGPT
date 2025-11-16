// api/ai.js
import { OpenAI } from 'openai';

console.log('AI.JS LOADED!'); // Debug: Cek import jalan

const apiKey = process.env.OPENAI_API_KEY;
console.log('API KEY LOADED:', apiKey ? 'YES' : 'NO'); // Debug: Cek key ada

if (!apiKey) {
  console.error('NO API KEY!');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export default async function handler(req, res) {
  console.log('REQUEST IN:', req.method, req.body); // Debug: Cek request masuk

  if (req.method !== 'POST') {
    console.log('WRONG METHOD');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { systemPrompt, userMessage } = req.body;

  if (!systemPrompt || !userMessage) {
    console.log('MISSING DATA');
    return res.status(400).json({ error: 'systemPrompt dan userMessage wajib diisi!' });
  }

  try {
    console.log('CALLING OPENAI...'); // Debug: Sebelum call

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Ganti ke ini dulu (gpt-4o-mini kadang quota error)
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.9,
      max_tokens: 1500,
    });

    const answer = completion.choices[0]?.message?.content || 'AI bengong, coba lagi.';

    console.log('OPENAI SUCCESS!'); // Debug: Sukses
    res.status(200).json({ answer });
  } catch (error) {
    console.error('OPENAI ERROR FULL:', error); // Debug: Error lengkap di log Vercel
    res.status(500).json({ 
      error: 'AI gagal nyanyi', 
      details: error.message, // Nunjukin error ke frontend juga
      fullError: error.toString() // Extra debug
    });
  }
}
