'use client';
import FileUpload from './components/FileUpload';
import LearnButton from './components/LearnButton';
import QuestionInput from './components/QuestionInput';

import { useState,  useEffect } from 'react';


export default function Home() {
  
  const [filesUploaded, setFilesUploaded] = useState<File[]>([]);
  const [learnReady, setLearnReady] = useState<boolean>(false);
  const [uploadReady, setUploadReady] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [reference, setReference] = useState<Array<any>>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {

    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;      // random number 0-15
        const v = c === 'x' ? r : (r & 0x3 | 0x8); // for 'y', force top 2 bits to 10
        return v.toString(16);                 // convert to hex
      });

    }    
  
    const id = generateUUID()
    
    if (id) {
      localStorage.setItem("userId", id);
      setUserId(id);
      console.log(id);
    }

  }, []);

  return (

    <div className="flex justify-center min-h-screen">
      <div className="flex flex-col items-center text-center bg-gray-700/35 w-fit h-fit p-6 rounded-4xl mb-10">
                
        <FileUpload 
          filesUploaded={filesUploaded} 
          setFilesUploaded={setFilesUploaded} 
          setLearnReady={setLearnReady} 
          setReferences={setReference} 
          setUploadReady={setUploadReady}

        />
        <LearnButton 
          filesUploaded={filesUploaded} 
          setLearnReady={setLearnReady} 
          uploadReady={uploadReady}
          setIsLoading = {setIsLoading}
          isLoading={isLoading} 
        />
        <QuestionInput 
          learnReady={learnReady}  
          question={question} 
          setQuestion={setQuestion} 
          references={reference} 
          setReferences={setReference}
          setIsLoading = {setIsLoading}
          isLoading={isLoading}  
        />

        { isLoading ? (

          <div className="flex flex-col justify-center items-center h-32">
          <div className="animate-spin rounded-full h-15 w-15 border-t-2 border-white"></div>
          <p className="animate-pulse mt-2 text-white">Loading...</p>
          </div>
          ) : ("")
        }
      </div>
    </div>

  );
}
