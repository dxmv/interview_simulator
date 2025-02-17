import { login } from '../../services/userServiceApi';
import { useToken } from '../../context/auth/TokenContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from '../../hooks/useForm';
import { Mail, Lock } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useCV } from '../../context/cv/CVContext';
interface LoginFormData {
    email: string;
    password: string;
}

const Login = () => {
    const { login: loginWithToken } = useToken();
    const { hasUploadedCV } = useCV();
    const { formData, error, handleChange, handleSubmit } = useForm<LoginFormData>({
        initialState: {
            email: '',
            password: ''
        },
        onSubmit: async (data) => {
            const response = await login(data);
            console.log(response)
            loginWithToken(response.token);
        },
        navigateTo: hasUploadedCV ? '/' : '/cv-upload'
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
                {/* Title of the login form */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Login</h1>
                <p className="text-gray-400 text-center mb-6">Welcome back! Please enter your details to login.</p>
                {/* Display error message if there is an error */}
                {error && (
                    <div className="mb-4 p-2 text-red-500 bg-red-50 rounded text-center">
                        {error}
                    </div>
                )}
                {/* Form for user input */}
                <form className="space-y-6 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                    {/* Input field for email */}
                    <Input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        required
                        icon={<Mail className="h-4 w-4 text-gray-500" />}
                        label="Email"
                    />
                    {/* Input field for password */}
                    <Input 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                        icon={<Lock className="h-4 w-4 text-gray-500" />}
                        label="Password"
                    />
                    {/* Submit button for the form */}
                    <Button type="submit" className="w-full mt-4">Log In</Button>
                </form>
                <div className="text-center mt-4 mb-4">
                    <div className="flex items-center justify-center">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="text-gray-500 mx-4">OR</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>
                </div>
                <p className="text-center text-gray-500">Don't have an account? <RouterLink to="/register" className="text-blue-500 hover:text-blue-700">Register</RouterLink></p>
            </div>
        </div>
    );
};

export default Login;