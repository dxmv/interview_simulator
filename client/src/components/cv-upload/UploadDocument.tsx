import { FC, useRef, useState, DragEvent } from 'react'
import { FileText, Upload, X } from 'lucide-react'

interface UploadDocumentProps {
    file: File | null // The currently selected file
    setFile: (file: File | null) => void // Function to update the selected file
}

// Functional component for uploading documents
export const UploadDocument: FC<UploadDocumentProps> = ({ file, setFile }) => {
    const [isDragging, setIsDragging] = useState(false) // State to track if a file is being dragged
    const fileInputRef = useRef<HTMLInputElement>(null) // Reference to the hidden file input
    
    // Handle file selection from the file input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] // Get the selected file
        setFile(file || null) // Update the file state
    }

    // Handle drag over event
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Prevent default behavior
        setIsDragging(true) // Set dragging state to true
    }

    // Handle drag leave event
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Prevent default behavior
        setIsDragging(false) // Set dragging state to false
    }

    // Handle file drop event
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Prevent default behavior
        setIsDragging(false) // Reset dragging state
        
        const file = e.dataTransfer.files?.[0] // Get the dropped file
        // Check if the file type is valid
        if (file && (file.type === 'application/pdf' || 
            file.type === 'application/msword' || 
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setFile(file) // Update the file state
        }
    }

    // Function to remove the selected file
    const removeFile = () => {
        setFile(null) // Clear the file state
        if (fileInputRef.current) {
            fileInputRef.current.value = '' // Reset the file input value
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
            />
            
            {!file ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative cursor-pointer
                        border-2 border-dashed rounded-xl
                        p-8 transition-all duration-200
                        flex flex-col items-center justify-center gap-4
                        ${isDragging 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                        }
                    `}
                >
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-700">
                            Drop your CV here
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            or click to browse
                        </p>
                    </div>
                    <p className="text-xs text-gray-400">
                        Supports PDF, DOC, DOCX
                    </p>
                </div>
            ) : (
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
