import { NextRequest } from 'next/server';
import path from "path";
import { writeFile, unlink } from "fs/promises";


const fs = require('fs');


export async function GET(req: NextRequest){

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


    const askAPIResponse = await fetch('http://127.0.0.1:8000/cleanup',{
        method: 'GET',
    })

    const data = await askAPIResponse.json()

    if(askAPIResponse.status == 400){
        return new Response(JSON.stringify({ error: data.message , status: 400 }));
    }
    else{
        return new Response(JSON.stringify({ message: "Clean up finished" , status: 200 }));
    }
    

    
}

   