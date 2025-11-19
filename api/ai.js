export async function askAI(promptText) {
  const response = await fetch(process.env.MODEL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: promptText,     // prompt dikirim
      max_tokens: 200         // parameter lain kalau butuh
    })
  });

  if (!response.ok) {
    throw new Error("API Error: " + response.status + " " + (await response.text()));
  }

  const data = await response.json();
  return data.response || data.text || data.output || data; 
}
