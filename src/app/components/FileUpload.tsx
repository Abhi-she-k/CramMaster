'use client';

import React from 'react';
import { useState } from 'react';
interface FileUploadProps {
  filesUploaded: File[];
  setFilesUploaded: React.Dispatch<React.SetStateAction<File[]>>;
  setLearnReady: React.Dispatch<React.SetStateAction<boolean>>;
  setReferences: React.Dispatch<React.SetStateAction<any[]>>;

}


export default function FileUpload({ filesUploaded, setFilesUploaded, setLearnReady, setReferences}: FileUploadProps) { // Update state in the parent component
  
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    setLearnReady(false)
    setReferences([])
      
    const cleanup = await fetch('/api/cleanup', {
        method: 'GET', 
    });

    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFilesUploaded(fileArray); // Update state in the parent component
    }
  };

  return (
    <div className='flex flex-col items-center text-center'>
      <label
        htmlFor="file_input"
        className="block text-sm p-3 my-5 w-100 border border-transparent rounded-lg cursor-pointer bg-sky-700/70 focus:outline-none"
      >
        Choose File (.pdf)
      </label>
      <input
        className="hidden"
        id="file_input"
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileChange}
      />
      <div className="flex flex-row bg-gray-500/20 rounded-lg overflow-auto w-250 max-w-9/10 justify-center">
        {filesUploaded.length > 0 &&
          filesUploaded.map((file, index) => (
            <div
              className="flex flex-col items-center text-center p-1 mx-1 bg-transparent"
              key={index}
            >
              <img
                src="/pdf.png"
                className="w-10 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                alt="PDF Icon"
              />
              <p className="font-normal w-50 truncate">
                {file.name} - {file.type.split('/')[1]}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}