import { SavedInterview } from "../types/interview";

const API_URL = 'http://127.0.0.1:5000/api/interview';

/**
 * Get all interviews
 * @returns all interviews
 */
export const getInterviews = async ():Promise<SavedInterview[]> => {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    return data;
};