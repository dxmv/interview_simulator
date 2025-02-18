import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Mail, Lock, Palette, Mic, Trash2, LogOut } from 'lucide-react';
import { useToken } from '../../context/auth/TokenContext';
import { useNavigate } from 'react-router-dom';

/**
 * Settings component allows users to manage their account settings,
 * including email, password, theme, and voice preferences.
 */
const Settings = () => {
    const navigate = useNavigate();
    const { logout } = useToken();
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [theme, setTheme] = useState('light');
    const [voice, setVoice] = useState('default');

    /**
     * Handles user logout by calling the logout function from context
     * and navigating to the login page.
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /**
     * Handles account deletion. Currently, this function is a placeholder
     * and needs to be implemented.
     */
    const handleDeleteAccount = () => {
        // TODO: Implement account deletion
        console.log('Delete account');
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            {/* Email Settings */}
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
                    <Button variant="outline" className="w-40">
                        Update Email
                    </Button>
                </div>
            </section>

            <Separator className="my-6" />

            {/* Password Settings */}
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
                    <Button variant="outline" className="w-40">
                        Change Password
                    </Button>
                </div>
            </section>

            <Separator className="my-6" />

            {/* Theme Settings */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Theme Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant={theme === 'light' ? 'default' : 'outline'}
                            onClick={() => setTheme('light')}
                            className="w-40"
                        >
                            <Palette className="mr-2 h-4 w-4" />
                            Light
                        </Button>
                        <Button
                            variant={theme === 'dark' ? 'default' : 'outline'}
                            onClick={() => setTheme('dark')}
                            className="w-40"
                        >
                            <Palette className="mr-2 h-4 w-4" />
                            Dark
                        </Button>
                    </div>
                </div>
            </section>

            <Separator className="my-6" />

            {/* Voice Settings */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Voice Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant={voice === 'default' ? 'default' : 'outline'}
                            onClick={() => setVoice('default')}
                            className="w-40"
                        >
                            <Mic className="mr-2 h-4 w-4" />
                            Default
                        </Button>
                        <Button
                            variant={voice === 'alternative' ? 'default' : 'outline'}
                            onClick={() => setVoice('alternative')}
                            className="w-40"
                        >
                            <Mic className="mr-2 h-4 w-4" />
                            Alternative
                        </Button>
                    </div>
                </div>
            </section>

            <Separator className="my-6" />

            {/* Account Actions */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Account Actions</h2>
                <div className="flex gap-4">
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        className="w-40"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-40"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Settings; 