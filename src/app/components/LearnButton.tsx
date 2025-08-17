'use client';

interface LearnButtonProps {
  uploadReady: boolean;
  filesUploaded: File[];
  setLearnReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LearnButton({ filesUploaded, setLearnReady, uploadReady}: LearnButtonProps) {
  
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

      const data_download = await responseDownloadFiles.json();

      // Check if the response is successful
      if (!responseDownloadFiles.ok) {
        throw new Error(`HTTP error! status: ${data_download.status} message: ${data_download.error}`);

      }
      else{
        console.log(`status: ${data_download.status} message: ${data_download.message}`)
        
        const responseLearn = await fetch('api/learn', {
          method: 'GET'
        })

        const data_response = await responseLearn.json()

        if (!responseLearn.ok){
          throw new Error(`HTTP error! status: ${data_response.status} message: ${data_response.error}`);
        }
        else if(data_response.status == 200){
          console.log(`status: ${data_response.status} message: ${data_response.message}`)
          setLearnReady(true)
        }
        else{
          console.error('Internal Error Learn Process...');
        }

      }

      // Parse the JSON response
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  if(uploadReady){

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

}
