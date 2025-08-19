import path from "path";
import { unlink } from "fs/promises";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const fileStoragePath = process.env.NEXT_PUBLIC_UPLOAD_DIR;
    if (!fileStoragePath) {
      console.error("UPLOAD_DIR environment variable is not defined.");
      return NextResponse.json(
        { error: "UPLOAD_DIR environment variable is not defined.", status: 500 }
      );
    }

    const req_json = await req.json();
    const UUID = req_json.uuid;

    if (!UUID) {
      console.error("Invalid input: 'uuid' is missing.");
      return NextResponse.json(
        { error: "Invalid input: 'uuid' is required.", status: 400 }
      );
    }


    console.log("Starting cleanup process for UUID:", UUID);

    if (!fs.existsSync(fileStoragePath)) {
      console.warn(`Directory does not exist: ${fileStoragePath}`);
      return NextResponse.json(
        { message: "No files to clean up.", status: 200 }
      );
    }

    const directoryContent = fs.readdirSync(fileStoragePath);
    for (const fileName of directoryContent) {
      const filePath = path.join(fileStoragePath, fileName);

      try {
        if (fs.statSync(filePath).isFile()) {
          await unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        }
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    }


    console.log("Local file cleanup completed.");

    const cleanupAPIResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}user_cleanup`,
      {
        method: "POST",
        headers: {
      
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: UUID })
      }
    );

    const data = await cleanupAPIResponse.json();

    if (!cleanupAPIResponse.ok) {
      console.error("Backend cleanup failed:", data);
      return NextResponse.json(
        { error: "Backend cleanup failed.", status: 500}
      );
    }

    console.log("Backend cleanup completed successfully.");
    return NextResponse.json(
      { message: "Cleanup finished successfully.", status: 200 }
    );
  } catch (err) {
    console.error("Error during cleanup:", err);
    return NextResponse.json(
      { error: "Cleanup failed due to an unexpected error.", status: 500 }
    );
  }
}