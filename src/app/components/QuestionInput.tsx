'use client'

import { NODE_ESM_RESOLVE_OPTIONS } from 'next/dist/build/webpack-config';
import { useRef , useState } from 'react';

interface QuestionInputProps {
    learnReady: boolean;
    question: string;
    setQuestion: React.Dispatch<React.SetStateAction<string>>;
    references: any[];
    setReferences: React.Dispatch<React.SetStateAction<any[]>>;
}




export default function QuestionInput({learnReady, question, setQuestion, references, setReferences}: QuestionInputProps){

    const textArea = useRef<HTMLTextAreaElement>(null);

    const answerArea = useRef<HTMLTextAreaElement>(null);
        
    const handleTextInput = () => {
        
        const textInput = textArea.current

        if(textInput){

            setQuestion(textInput.value)
        
        }
    }

    const handleAsk = async () => {
        
        const askResponse = await fetch('/api/ask', {
                method: 'POST',
                body: JSON.stringify(question)
            })

            const data = await askResponse.json()

            console.log(data)

            const answer = answerArea.current
            
            if(answer){
                answer.value = data.answer
            }

            setReferences(data.references)

            console.log(references)

            // if(askResponse.status == 200){
            //     console.log(askResponse.references)
            // }

    }

    if(learnReady){
        
        return (
            
            <div className='text-center '>
                <div className='flex-col justify-content' onChange={ handleTextInput }>
                    <textarea id="message" ref ={textArea} rows={10} className="w-200 block p-2.5 w-2xl text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Question Here..."></textarea>
                </div>

                <button
                    type="button"
                    onClick={ handleAsk }
                    className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 my-5 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-xl text-lg px-8 py-4 text-center"
                    >
                    Ask ⇒
                </button>

                <div className='flex-col justify-content'>
                    <textarea id="response" ref = { answerArea }rows={10} className="w-200 block p-2.5 w-2xl text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                </div>

                <table className="mt-10 w-200 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Possible References
                            </th>
                            <th scope="col" className="px-6 py-3">
                                File
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(references).map((item: any, idx: number) => (
                        <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <td
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-normal break-words dark:text-white max-w-0"
                                style={{ wordBreak: "break-word" }}
                            >
                                {item.reference || item.text || ""}
                            </td>

                                                        <td
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-normal break-words dark:text-white max-w-0"
                                style={{ wordBreak: "break-word" }}
                            >
                                {item.file || item.fileName || ""}
                            </td>
                        </tr>))}
                    </tbody>
                </table>
            </div>
        );
        
    }





}
