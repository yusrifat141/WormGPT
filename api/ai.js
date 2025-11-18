import fetch from "node-fetch";

const API_KEY = "ISI_TOKEN_MU";

async function askDeepSeek(prompt) {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat", // ganti ke "deepseek-reasoner" kalau mau R1
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const result = await response.json();
    console.log(result.choices[0].message.content);

  } catch (err) {
    console.error("Error:", err);
  }
}

askDeepSeek("Halo, ini test.");
