import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const files = await req.formData();

    if (!files || !files.entries().next().value) {
      console.error("No files provided in the request.");
      return NextResponse.json(
        { error: "No files provided.", status: 400 },
      );
    }

    console.log("Received files for upload.");

    const form = new FormData();
    for (const [_, file] of files.entries()) {
      form.append("files", file);
    }

    console.log("FormData prepared for upload.");

    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}upload`, {
      method: "POST",
      body: form,
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

    console.log("Uploaded successfully:", uploadData);

    return NextResponse.json(
      { message: "File uploaded successfully", status: 200 },
      { status: 200 }
    );

  } catch (error) {
    console.error("Unexpected error during file upload:", error);
    return NextResponse.json(
      { error: "Could not process files due to an unexpected error.", status: 500 },
      { status: 500 }
    );
  }
}