import { login } from '../../services/userServiceApi';
import { storeToken } from '../../auth/local_storage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from '../../hooks/useForm';

interface LoginFormData {
    email: string;
    password: string;
}

const Login = () => {
    const { formData, error, handleChange, handleSubmit } = useForm<LoginFormData>({
        initialState: {
            email: '',
            password: ''
        },
        onSubmit: async (data) => {
            const response = await login(data);
            storeToken(response.token);
        },
        navigateTo: '/'
    });

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
                <form className="space-y-4 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                    {/* Input field for email */}
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                    {/* Input field for password */}
                    <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                    {/* Submit button for the form */}
                    <Button type="submit">Log In</Button>
                </form>
            </div>
        </div>
    );
};

export default Login;