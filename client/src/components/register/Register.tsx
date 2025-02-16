import { register } from '../../services/userServiceApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from '../../hooks/useForm';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
                {/* Title of the registration form */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create an account</h1>
                {/* Display error message if there is an error */}
                {error && (
                    <div className="mb-4 p-2 text-red-500 bg-red-50 rounded text-center">
                        {error}
                    </div>
                )}
                {/* Form for user input */}
                <form className="space-y-4 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                    {/* Input field for name */}
                    <Input type="text" name="name" placeholder="Full Name..." value={formData.name} onChange={handleChange} required />
                    {/* Input field for email */}
                    <Input type="email" name="email" placeholder="Email..." value={formData.email} onChange={handleChange} required />
                    {/* Input field for password */}
                    <Input type="password" name="password" placeholder="Password..." value={formData.password} onChange={handleChange} required />
                    {/* Input field for confirm password */}
                    <Input type="password" name="confirmPassword" placeholder="Confirm Password..." value={formData.confirmPassword} onChange={handleChange} required />
                    {/* Submit button for the form */}
                    <Button type="submit">Register</Button>
                </form>
            </div>
        </div>
    );
};

export default Register;