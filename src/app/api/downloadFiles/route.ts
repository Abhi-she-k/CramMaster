import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    const fileInfo = await req.formData()

    if (!fileInfo || !fileInfo.entries().next().value) {
      console.error("No info provided in the request.");
      return NextResponse.json(
        { error: "No info provided.", status: 400 },
      );
    }

    console.log("Received files for upload.");

    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}upload`, {
      method: "POST",
      body: fileInfo,
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error("Failed to upload file to FastAPI:", uploadData);
      return NextResponse.json(
        {
          error: uploadData.message || "Failed to upload file to FastAPI.",
          status: uploadResponse.status || 500,
        },
      );
    }
    else{

      console.log("Uploaded successfully:", uploadData);

      return NextResponse.json(
        { message: "File uploaded successfully", status: 200 },
        { status: 200 }
      );

    }

  } catch (error) {
    console.error("Unexpected error during file upload:", error);
    return NextResponse.json(
      { error: "Could not process files due to an unexpected error.", status: 500 },
      { status: 500 }
    );
  }
}