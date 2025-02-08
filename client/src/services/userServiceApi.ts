import { User } from "../types/user_types";
import { storeToken } from "../auth/local_storage";

const API_URL = 'http://127.0.0.1:5000/api/user';

interface RegisterData {
    email: string;
    name: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface UserResponse {
    email: string;
    name: string;
}

/**
 * Register a new user
 * @param userData - user registration data
 * @returns user data if registration successful
 */
export const register = async (userData: RegisterData): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
};


/**
 * Login a user
 * @param credentials - login credentials
 * @returns user data if login successful
 */
export const login = async (credentials: LoginData): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    storeToken(data.token);
    return data.user;
};

/**
 * Get user profile
 * @returns user profile data
 */
export const getProfile = async (): Promise<User> => {
    const response = await fetch(`${API_URL}/profile`);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch profile');
    }

    return response.json();
};

/**
 * Update user profile
 * @param profileData - profile data to update
 * @returns updated profile data
 */
export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
}; 