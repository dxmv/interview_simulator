import { register } from '../../services/userServiceApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from '../../hooks/useForm';
import { Mail, User, Lock, KeyRound, Link } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const { formData, error, handleChange, handleSubmit, setError } = useForm<RegisterFormData>({
        initialState: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        onSubmit: async (data) => {
            if (data.password !== data.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            await register({
                name: data.name,
                email: data.email,
                password: data.password
            });
        },
        navigateTo: '/login'
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
                {/* TODO: Add a logo */}
                {/* Title of the registration form */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Create an account</h1>
                <p className="text-gray-400 text-center mb-4">Join our platform to start your interview preparation journey.</p>
               {/* Display error message if there is an error */}
                {error && (
                    <div className="mb-4 p-2 text-red-500 bg-red-50 rounded text-center">
                        {error}
                    </div>
                )}
                {/* Form for user input */}
                <form className="space-y-6 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                    {/* Input field for name */}
                    <Input 
                        type="text" 
                        label="Name"
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full"
                        icon={<User className="h-4 w-4 text-gray-500" />} 
                    />
                    {/* Input field for email */}
                    <Input 
                        type="email" 
                        label="Email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full"
                        icon={<Mail className="h-4 w-4 text-gray-500" />} 
                    />
                    {/* Input field for password */}
                    <Input 
                        type="password" 
                        label="Password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        className="w-full"
                        icon={<Lock className="h-4 w-4 text-gray-500" />}
                    /> 
                    {/* Input field for confirm password */}
                    <Input 
                        type="password" 
                        label="Confirm Password" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                        className="w-full" 
                        icon={<KeyRound className="h-4 w-4 text-gray-500" />}
                    />
                    {/* Submit button for the form */}
                    <Button type="submit" className="w-full mt-4">Get Started</Button>
                </form>
                <div className="text-center mt-4 mb-4">
                    <div className="flex items-center justify-center">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="text-gray-500 mx-4">OR</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>
                </div>
                <p className="text-center text-gray-500">Already have an account? <RouterLink to="/login" className="text-blue-500 hover:text-blue-700">Login</RouterLink></p>
            </div>
        </div>
    );
};

export default Register;