import { useState } from 'react';
import { register } from '../../services/userServiceApi';
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const navigate = useNavigate(); // to navigate to the login page after registration
    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    // State to hold error messages
    const [error, setError] = useState('');

    /**
     * Handle input changes for the form fields
     * @param e - The event object from the input field
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Handle form submission
     * @param e - The event object from the form
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
                {/* Title of the registration form */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Register</h1>
                {/* Display error message if there is an error */}
                {error && (
                    <div className="mb-4 p-2 text-red-500 bg-red-50 rounded text-center">
                        {error}
                    </div>
                )}
                {/* Form for user input */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Input field for name */}
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Input field for email */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Input field for password */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Input field for confirm password */}
                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Submit button for the form */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;