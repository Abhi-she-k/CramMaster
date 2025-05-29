import { NextRequest } from 'next/server';
import multer from 'multer';
import path from "path";
import { writeFile } from "fs/promises";
import { stat, write } from 'fs';

export async function GET(req: NextRequest ){

    try{

        const response = await fetch('http://127.0.0.1:8000/learn')

        const data = await response.json()

        if(data.status == 400){
            return new Response(JSON.stringify({message: data.message, status: 400}))
        }
        else{
            return new Response(JSON.stringify({message: data.message, status: 200}))
        }

    }
    catch{

        return new Response(JSON.stringify({error: "Learn Process Process Failed"}), {status:400})
        
    }
    




}