import { FC, useRef } from 'react'

interface UploadDocumentProps {
    file: File | null
    setFile: (file: File | null) => void
}

export const UploadDocument: FC<UploadDocumentProps> = ({ file, setFile }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setFile(file || null)
    }
    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }
    return (
        <>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />
        <button
            onClick={triggerFileInput}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        >
            Choose File
        </button>
    </>
    )
}
