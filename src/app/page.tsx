'use client';
import FileUpload from '@/app/components/FileUpload';
import LearnButton from '@/app/components/LearnButton';
import QuestionInput from '@/app/components/QuestionInput';

import { use, useState} from 'react';


export default function Home() {
  
  const [filesUploaded, setFilesUploaded] = useState<File[]>([]);
  const [learnReady, setLearnReady] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [reference, setReference] = useState<Array<any>>([]);

  
  return (

    <div className="flex flex-col items-center text-center">
      <FileUpload filesUploaded={filesUploaded} setFilesUploaded={setFilesUploaded} setLearnReady={setLearnReady} setReferences={ setReference } />
      <LearnButton filesUploaded={filesUploaded} setLearnReady={setLearnReady} />
      <QuestionInput learnReady = {learnReady}  question = {question} setQuestion={setQuestion} references={reference} setReferences={setReference} />
    </div>

  );
}
