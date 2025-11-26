export async function POST(req) {
  const { messages } = await req.json();

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(err, { status: 500 });
    }

    const data = await response.json();
    return Response.json(data);

  } catch (e) {
    return new Response("Internal Error: " + e.message, { status: 500 });
  }
}
