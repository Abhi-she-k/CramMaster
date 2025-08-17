import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const userInput = await req.json();
    console.log("User input:", userInput);

    const askAPIResponse = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: userInput }),
    });

    const data = await askAPIResponse.json();

    console.log("FastAPI response:", data);

    if (!askAPIResponse.ok) {
      return new Response(JSON.stringify({
        error: data?.message || "FastAPI error", status: askAPIResponse.status || 500}));
    }

    return new Response(JSON.stringify({
      answer: data.answer,
      references: data.references,
      status: 200
    }));

  } catch (err) {
    console.error("Error in /api/ask POST:", err);
    return new Response(JSON.stringify({
      error: "Unexpected error",
      status: 500
    }));
  }
}
