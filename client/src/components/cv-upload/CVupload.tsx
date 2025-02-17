import { FC, useState } from 'react'
import { PrimaryButton } from '../reusable/PrimaryButton'
import { UploadDocument } from './UploadDocument';
import { uploadCV } from '../../services/cvServiceApi';
import { useToken } from '../../context/auth/TokenContext';
interface CVuploadProps {
  onUpload: (file: File) => void
}

export const CVupload: FC<CVuploadProps> = () => {
    const [file, setFile] = useState<File | null>(null);
    const { getToken } = useToken();
    const handleUpload = async () => {
        if (file) {
            try {
                const token = getToken();
                console.log(token)
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await uploadCV(file, token)
                console.log(response)
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <div className="bg-gray-100 p-4 rounded-md w-full h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Step 1: Upload your CV</h1>
        <UploadDocument file={file} setFile={setFile} />
        <PrimaryButton onClick={handleUpload} text="Next" disabled={file === null} />
        </div>
    )
}

