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

/**
 * Delete an interview
 * @param id - the id of the interview to delete
 * @returns true if the interview was deleted, false otherwise
 */
export const deleteInterview = async (id: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return response.ok;
};