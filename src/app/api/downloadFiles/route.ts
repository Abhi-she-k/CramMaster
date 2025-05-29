import { NextRequest } from 'next/server';
import path from "path";
import { writeFile, unlink } from "fs/promises";

const fs = require('fs');

export async function POST(req: NextRequest){
  // Example response data
  try {
    var files = await req.formData();

    const fileStoragePath = 'tmp/uploads'

    console.log("Downloading Files...")
        
    const directoryContent =  fs.readdirSync(fileStoragePath);

    console.log("Cleaning up...")

    console.log(directoryContent)

    if (directoryContent.length > 0) {
        directoryContent.map(async (fileName: string) => {
        const filePath = path.join(fileStoragePath, fileName);
        try {
          await unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        } catch (err) {
          console.log(err);
        }
      })

    }
    console.log(directoryContent)

    if(Array.from(files.keys()).length === 0) {

      return new Response(JSON.stringify({ error: "No files found", status: 400 }));

    }  

    console.log(files)
  
    files.forEach(async (file) => {
      if (file instanceof File) {
        // Convert the file to an ArrayBuffer
        const pathToFile = path.join(fileStoragePath, file.name);
        const bytes = await file.arrayBuffer();
        const buffer = await Buffer.from(bytes);
        await writeFile(pathToFile, buffer);    
      } else {
        return new Response(JSON.stringify({ error: "No file found or invalid file type.", status: 400 }));
      }
    });

    return new Response(JSON.stringify({ message: "File uploaded successfully", status: 200 }));
  }
  catch{
    return new Response(JSON.stringify({ error: "Could not process files", status : 400}));
  }
}