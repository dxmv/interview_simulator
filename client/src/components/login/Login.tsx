import { useState } from 'react';
import { login } from '../../services/userServiceApi';
import { storeToken } from '../../auth/local_storage';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate(); // to navigate to the home page after login
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    }); // State to hold form data for email and password
    const [error, setError] = useState(''); // State to hold any error messages

    /**
     * Handle input changes for the form fields
     * @param e - The event object from the input field
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handle form submission
     * @param e - The event object from the form
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await login(formData);
            storeToken(response.token); // store the token in local storage
            navigate('/'); // navigate to the home page after successful login
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
                {/* Title of the login form */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h1>
                {/* Display error message if there is an error */}
                {error && (
                    <div className="mb-4 p-2 text-red-500 bg-red-50 rounded text-center">
                        {error}
                    </div>
                )}
                {/* Form for user input */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Input field for email */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Input field for password */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Submit button for the form */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;