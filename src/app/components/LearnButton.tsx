'use client';

import { useState } from 'react';

interface FileUploadProps {
  filesUploaded: File[];
  setFilesUploaded: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function LearnButton({ filesUploaded, setFilesUploaded }: FileUploadProps) {
  const processFiles = async () => {
    try {
      console.log('Processing files...');


      const formData = new FormData();
      filesUploaded.forEach((file) => {
        formData.append('file', file); // Append each file to the FormData object
      });

      const responseDownloadFiles = await fetch('/api/downloadFiles', {
        method: 'POST', 
        body: formData
      });

      var data = await responseDownloadFiles.json();

      // Check if the response is successful
      if (data.status == 400) {
        throw new Error(`HTTP error! status: ${data.status} message: ${data.error}`);
      }
      else{
        console.log(`status: ${data.status} message: ${data.message}`)
        
        const responseLearn = await fetch('api/learn', {
          method: 'GET'
        })

        var data = await responseLearn.json()

        console.log(data)

      }

      // Parse the JSON response
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={processFiles}
      className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 my-5 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-xl text-lg px-8 py-4 text-center"
    >
      Study ⇒
    </button>
  );
}
