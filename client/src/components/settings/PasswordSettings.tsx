import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Lock } from 'lucide-react';
import { useToken } from '../../context/auth/TokenContext';
import { changePassword } from '@/services/userServiceApi';

const PasswordSettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { getToken } = useToken();

    const handleChangePassword = async () => {
        // Reset messages
        setError(null);
        setSuccessMessage(null);

        // Validate inputs
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        setIsUpdating(true);

        try {
            const token = getToken();
            if (!token) {
                setError('No token found');
                return;
            }
            await changePassword(currentPassword, newPassword, token);
            setSuccessMessage('Password changed successfully');
            // Clear inputs
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Password Settings</h2>
            <div className="space-y-4">
                <Input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="max-w-md"
                    icon={<Lock className="h-4 w-4 text-gray-500" />}
                />
                <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="max-w-md"
                    icon={<Lock className="h-4 w-4 text-gray-500" />}
                />
                <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="max-w-md"
                    icon={<Lock className="h-4 w-4 text-gray-500" />}
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
                    onClick={handleChangePassword}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Change Password'}
                </Button>
            </div>
        </section>
    );
};

export default PasswordSettings; 