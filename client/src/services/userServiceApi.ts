import { User } from "../types/user_types";

const API_URL = 'http://127.0.0.1:5000/api/user';
const TOKEN_KEY = 'token';

interface RegisterData {
    email: string;
    name: string;
    password: string;
}

interface UserResponse {
    email: string;
    name: string;
}

interface LoginResponse {
    token: string;
    user?: {
        id: number;
        email: string;
        created_at: string;
        updated_at: string;
    };
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
export const login = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
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
    if (!data.token) {
        throw new Error('No token received from server');
    }

    return data;
};

/**
 * Get user profile
 * @returns user profile data
 */
export const getProfile = async (): Promise<User> => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_URL}/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch profile');
    }

    const data = await response.json();
    return data.user;
};

/**
 * Update user profile
 * @param profileData - profile data to update
 * @returns updated profile data
 */
export const updateProfile = async (email: string,token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
    }

    const data = await response.json();
    return data.user;
}; 

/**
 * Delete user account
 * @returns void
 */
export const deleteAccount = async (token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
    }
};

/**
 * Change user password
 * @param currentPassword - current password
 * @param newPassword - new password
 * @param token - user token
 * @returns void
 */
export const changePassword = async (currentPassword: string, newPassword: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
    }
};
