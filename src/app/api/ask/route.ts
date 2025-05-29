import { NextRequest } from 'next/server';


export async function POST(req: NextRequest){

    const userInput = await req.json()

    console.log(userInput)
    

    const askAPIResponse = await fetch('http://127.0.0.1:8000/ask',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: userInput })}
    )

    const data = await askAPIResponse.json()

    console.log(data.answer)

    if(data.status == 400){
        
        return new Response(JSON.stringify({ error: data.message , status: 400 }));

    }
    else{

        return new Response(JSON.stringify({ answer: data.answer, references: data.references, status:200}))

    }

}