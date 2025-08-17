'use client';
import FileUpload from './components/FileUpload';
import LearnButton from './components/LearnButton';
import QuestionInput from './components/QuestionInput';

import { useState} from 'react';


export default function Home() {
  
  const [filesUploaded, setFilesUploaded] = useState<File[]>([]);
  const [learnReady, setLearnReady] = useState<boolean>(false);
  const [uploadReady, setUploadReady] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [reference, setReference] = useState<Array<any>>([]);

  
  return (

    <div className="flex flex-col items-center text-center">
      <FileUpload filesUploaded={filesUploaded} setFilesUploaded={setFilesUploaded} setLearnReady={setLearnReady} setReferences={ setReference } setUploadReady={setUploadReady}/>
      <LearnButton filesUploaded={filesUploaded} setLearnReady={setLearnReady} uploadReady={uploadReady} />
      <QuestionInput learnReady = {learnReady}  question = {question} setQuestion={setQuestion} references={reference} setReferences={setReference} />
    </div>

  );
}
