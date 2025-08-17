import path from "path";
import { unlink } from "fs/promises";
import fs from "fs";

export async function GET() {

  const fileStoragePath = process.env.NEXT_PUBLIC_UPLOAD_DIR;

  console.log("Cleaning up local files...");

  try {

    if (!fileStoragePath) {
      throw new Error("UPLOAD_DIR environment variable is not defined");
    }

    const directoryContent = fs.readdirSync(fileStoragePath);

    for (const fileName of directoryContent) {
      const filePath = path.join(fileStoragePath, fileName);
      
      try {
        if (fs.statSync(filePath).isFile()){
          await unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        }

      } catch (err) {
        console.error(`Failed to delete ${fileName}:`, err);
      }
    }

    // Notify FastAPI backend
    const askAPIResponse = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'cleanup', {
      method: 'GET',
    });

    const data = await askAPIResponse.json();

    if (!askAPIResponse.ok) {
      return new Response(JSON.stringify({ error: data.message || "Backend cleanup failed", status: askAPIResponse.status}));
    }

    return new Response(JSON.stringify({ message: "Clean up finished", status: 200}));

  } catch (err) {
    console.error("Error during cleanup:", err);
    return new Response(JSON.stringify({ error: "Cleanup failed", status: 500}));
  }
}
