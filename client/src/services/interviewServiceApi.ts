import { SavedInterview } from "../types/interview";

const API_URL = 'http://127.0.0.1:5000/api/interview';

/**
 * Get all interviews for the current user
 * @param token - JWT token for authentication
 * @returns all interviews
 */
export const getInterviews = async (token: string): Promise<SavedInterview[]> => {
    const response = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch interviews');
    }

    return response.json();
};

/**
 * Delete an interview
 * @param id - the id of the interview to delete
 * @param token - JWT token for authentication
 * @returns true if the interview was deleted, false otherwise
 */
export const deleteInterview = async (id: number, token: string): Promise<SavedInterview[]> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete interview');
    }

    return response.json();
};

// /**
//  * Save an interview
//  * @param data - the interview data to save
//  * @param token - JWT token for authentication
//  * @returns the saved interview
//  */
// export const saveInterview = async (data: {
//     messages: any[];
//     summary?: string;
//     grade?: number;
// }, token: string): Promise<SavedInterview> => {
//     const response = await fetch(`${API_URL}/`, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     });

//     if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to save interview');
//     }

//     return response.json();
// };

/**
 * Get a specific interview
 * @param id - the id of the interview to get
 * @param token - JWT token for authentication
 * @returns the interview
 */
export const getInterview = async (id: number, token: string): Promise<SavedInterview> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch interview');
    }

    return response.json();
};