import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const req_json = await req.json();
    const question = req_json.question;

    const UUID = req_json.uuid;

    if (!question || !UUID) {
      console.error("Invalid input: 'question' or 'uuid' is missing.");
      return NextResponse.json(
        { error: "Invalid input: 'question' and 'uuid' are required.", status: 400 },
      );
    }


    console.log("User input received:", { question, UUID });

    const askAPIResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question, UUID: UUID }),
    });

    if (!askAPIResponse.ok) {
      const errorData = await askAPIResponse.json();
      console.error("FastAPI error response:", errorData);
      return NextResponse.json(
        {
          error: errorData?.message || "FastAPI error occurred.",
          status: askAPIResponse.status || 500,
        },
      );
    }

    const data = await askAPIResponse.json();
    console.log("FastAPI response received:", data);

    if (!data.answer || !data.references) {
      console.error("Invalid response from FastAPI:", data);
      return NextResponse.json(
        { error: "Invalid response from FastAPI.", status: 502 },
      );
    }

    return NextResponse.json(
      {
        answer: data.answer,
        references: data.references,
        status: 200,
      },
    );

  } catch (err) {

    console.error("Unexpected error in /api/ask POST:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred.", status: 500 },
    );
  }
}