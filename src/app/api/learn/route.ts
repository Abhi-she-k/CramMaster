import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const req_json = await req.json();
    const UUID = req_json.uuid;

    if (!UUID) {
      console.error("Invalid input: 'uuid' is missing.");
      return NextResponse.json(
        { error: "Invalid input: 'uuid' is required.", status: 400 },
        { status: 400 }
      );
    }

    console.log("Starting learn process for UUID:", UUID);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}learn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: UUID }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("FastAPI /learn request failed:", data);
      return NextResponse.json(
        {
          error: data.message || "Learn request failed.",
          status: response.status || 500,
        },
      );
    }
    else{

      console.log("Learn Process Finished - Response:", data);

      return NextResponse.json(
        { message: data.message, status: 200 },
      );

    }
  } catch (error) {
    console.error("Unexpected error during learn process:", error);
    return NextResponse.json(
      { error: "Learn process failed due to an unexpected error.", status: 500 },
    );
  }
}