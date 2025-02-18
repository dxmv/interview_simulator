import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail } from 'lucide-react';
import { updateProfile } from '@/services/userServiceApi';
import { useToken } from '../../context/auth/TokenContext';

const EmailSettings = () => {
    const [email, setEmail] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { getToken } = useToken();

    const handleUpdateEmail = async () => {
        if (!email) {
            setError('Please enter a new email address');
            setSuccessMessage(null);
            return;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            setSuccessMessage(null);
            return;
        }
        setError(null);
        setSuccessMessage(null);
        setIsUpdating(true);

        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found');
            }
            await updateProfile(email, token);
            setSuccessMessage('Email updated successfully');
            setEmail(''); // Clear the input
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update email');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Email Settings</h2>
            <div className="space-y-4">
                <Input
                    type="email"
                    placeholder="New Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="max-w-md"
                    icon={<Mail className="h-4 w-4 text-gray-500" />}
                />
                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="text-green-500 text-sm">
                        {successMessage}
                    </div>
                )}
                <Button 
                    variant="outline" 
                    className="w-40"
                    onClick={handleUpdateEmail}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Email'}
                </Button>
            </div>
        </section>
    );
};

export default EmailSettings; 