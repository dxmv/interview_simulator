import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseFormProps<T> {
    initialState: T;
    onSubmit: (data: T) => Promise<void>;
    navigateTo?: string;
}

export const useForm = <T extends Record<string, any>>({ 
    initialState, 
    onSubmit, 
    navigateTo 
}: UseFormProps<T>) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<T>(initialState);
    const [error, setError] = useState('');

    /**
     * Handles the change of the form data
     * @param e - The event of the change
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handles the submission of the form
     * @param e - The event of the submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await onSubmit(formData);
            if (navigateTo) {
                navigate(navigateTo);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        }
    };

    return {
        formData,
        error,
        handleChange,
        handleSubmit,
        setError
    };
}; 