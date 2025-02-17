import { CVAnalysis } from '../types/cv_types';

const API_URL = 'http://127.0.0.1:5000/api/cv/';
const TOKEN_KEY = 'token';

/**
 * Upload a CV file
 * @param file the CV file to upload
 * @returns the CV analysis
 */
export const uploadCV = async (file: File, token: string) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_URL}upload`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
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
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get CV analysis')
    }
    
    return response.json()
}

/**
 * Update the CV analysis
 * @returns the CV analysis
 */
export const updateCvAnalysis = async (cvAnalysis: CVAnalysis) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_URL}update`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cvAnalysis)
    })
    
    return response.json()
}