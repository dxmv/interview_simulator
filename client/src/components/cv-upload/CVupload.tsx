import { FC, useState } from 'react'
import { UploadDocument } from './UploadDocument';
import { uploadCV } from '../../services/cvServiceApi';
import { useToken } from '../../context/auth/TokenContext';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { CVAnalysis } from '../../types/cv_types';

// Define the props for the CVupload component
interface CVuploadProps {
    onUpload?: (newAnalysis: CVAnalysis) => void; // Callback for when a CV is uploaded
    isInline?: boolean; // Determines if the upload is inline or in a separate view
}

// Functional component for uploading CVs
export const CVupload: FC<CVuploadProps> = ({ onUpload, isInline = false }) => {
    const [file, setFile] = useState<File | null>(null); // State to hold the selected file
    const navigate = useNavigate(); // Hook to programmatically navigate
    const { getToken } = useToken(); // Hook to get the authentication token
    const [error, setError] = useState<string | null>(null); // State to hold any error messages
    const [isUploading, setIsUploading] = useState(false); // State to track upload status

    // Function to handle the file upload
    const handleUpload = async () => {
        if (!file) return; // Exit if no file is selected

        setIsUploading(true); // Set uploading state to true
        setError(null); // Reset any previous error

        try {
            const token = getToken(); // Retrieve the token
            if (!token) {
                throw new Error('No token found');
            }
            const response = await uploadCV(file, token); // Upload the CV
            onUpload?.(response); // Call the onUpload callback with the response
            
            // Navigate to home if not inline (note: navigateTo is not defined)
            if (!isInline) {
                navigate('/');
            }
        } catch (error) {
            // Set error message if upload fails
            setError(error instanceof Error ? error.message : 'Failed to upload CV');
        } finally {
            setIsUploading(false); // Reset uploading state
        }
    }

    // Render inline upload component if isInline is true
    if (isInline) {
        return (
            <div className="inline-block">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="cv-upload-inline"
                />
                <label 
                    htmlFor="cv-upload-inline"
                    className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer inline-block"
                >
                    Upload New CV
                </label>
                {file && (
                    <Button 
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="ml-2"
                    >
                        {isUploading ? 'Uploading...' : 'Confirm Upload'}
                    </Button>
                )}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        );
    }

    // Render full upload component if not inline
    return (
        <div className="bg-gray-100 p-4 rounded-md w-full h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-2">Please upload your CV</h1>
            <p className="mb-4 text-gray-500">You must upload your CV to continue</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <UploadDocument file={file} setFile={setFile} />
            <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading} 
                className="mt-6"
            >
                {isUploading ? 'Uploading...' : 'Upload now'}
            </Button>
            <Button 
                onClick={() => navigate('/')} 
                className="mt-4"
                variant="outline"
            >
                Skip for now
            </Button>
        </div>
    );
}
