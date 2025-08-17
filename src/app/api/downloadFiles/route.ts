import { NextRequest } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const files = await req.formData();

    const form = new FormData();

    for (const [_,file] of files.entries()) {
        form.append("files", file);
    }

    const upload = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + 'upload', {
      method: "POST",
      body: form,
    });

    console.log(upload)

    if (upload.ok) {
      const res = await upload.json();
      console.log("Uploaded:", res);
      return new Response(JSON.stringify({ message: "File uploaded successfully", status: 200}));
    } else {
      return new Response(JSON.stringify({ error: "Failed to upload file to FastAPI", status: 400}));
    }
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Could not process files", status: 400}));
  }
}
