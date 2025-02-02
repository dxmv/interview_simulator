const API_URL = 'http://127.0.0.1:5000/cv/'

/**
 * Upload a CV file
 * @param file the CV file to upload
 * @returns the CV analysis
 */
export const uploadCV = async (file: File) => {
    const formData = new FormData()
    const blob = new Blob([file], { type: file.type })
    formData.append('file',blob, file.name)
    
    const response = await fetch(`${API_URL}upload`, {
        method: 'POST',
        body: formData
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload file')
    }
    
    return response.json()
}

/**
 * Get the CV analysis
 * @returns the CV analysis
 */
export const getCvAnalysis = async () => {
    const response = await fetch(`${API_URL}`, {
        method: 'GET'
    })
    return response.json()
}