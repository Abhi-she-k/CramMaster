'use client';

interface LoadingState {
  message: string;
  status: boolean;
}

interface LearnButtonProps {
  uploadReady: boolean;
  filesUploaded: File[];
  setLearnReady: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: LoadingState;
  setIsLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
}

export default function LearnButton({ filesUploaded, setLearnReady, uploadReady, isLoading, setIsLoading}: LearnButtonProps) {
  
  const processFiles = async () => {
    
    try {

      const UUID = localStorage.getItem("userId")

      console.log('Processing files...');

      setIsLoading({message: "Downloading file(s)...",
                    status: true})

      const formData = new FormData();
      
      if (!UUID) {
        throw new Error("No UUID found in localStorage");
      }
      
      formData.append("uuid", UUID);

      for (const file of filesUploaded) {
        formData.append('files', file); 
      };

      const responseDownloadFiles = await fetch('/api/downloadFiles', {
        method: 'POST', 
        body: formData
      });

      const dataDownloadResponse = await responseDownloadFiles.json();

      // Check if the response is successful
      if (!responseDownloadFiles.ok) {
        throw new Error(`HTTP error! status: ${dataDownloadResponse.status} message: ${dataDownloadResponse.error}`);
      }

      console.log(`status: ${dataDownloadResponse.status} message: ${dataDownloadResponse.message}`)

      setIsLoading({message: "Processing Files and Learning Content...",
        status: true})
      
      const responseLearn = await fetch('api/learn', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid: UUID })
      })

      const dataLearnResponse = await responseLearn.json()

      if (!responseLearn.ok){
        throw new Error(`HTTP error! status: ${dataLearnResponse.status} message: ${dataLearnResponse.error}`);
      }

      console.log(`status: ${dataLearnResponse.status} message: ${dataLearnResponse.message}`)

      console.log("Local clean up on user: ", UUID)

      setIsLoading({message: "Cleaning Up",
        status: true})

      const localCleanup = await fetch('/api/cleanupLocal', {
        method: 'POST', 
        body: JSON.stringify({ uuid: UUID })
      });

      const localCleanupResponse = await localCleanup.json()

      if (!localCleanup.ok){
        throw new Error(`HTTP error! status: ${localCleanupResponse.status} message: ${localCleanupResponse.error}`);
      }
          
      setLearnReady(true)

    } catch (error) {
      console.error('Error processing files:', error);
    }

    setIsLoading({message: "Loading",
      status: false})
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
