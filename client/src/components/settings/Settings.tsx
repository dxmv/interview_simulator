import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Mail, Lock, Sun, Moon } from 'lucide-react';
import AccountActions from './AccountActions';
import { useTheme } from '../../context/theme/ThemeContext';

/**
 * Settings component allows users to manage their account settings,
 * including email, password, theme, and voice preferences.
 */
const Settings = () => {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { theme, toggleTheme } = useTheme();

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
                    <Button
                        variant="outline"
                        onClick={toggleTheme}
                        className={`w-40 ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-blue-50 hover:bg-blue-100'}`}
                    >
                        {theme === 'light' ? (
                            <>
                                <Moon className="mr-2 h-4 w-4" />
                                Dark Mode
                            </>
                        ) : (
                            <>
                                <Sun className="mr-2 h-4 w-4" />
                                Light Mode
                            </>
                        )}
                    </Button>
                </div>
            </section>

            <Separator className="my-6" />

            {/* Account Actions */}
            <AccountActions />
        </div>
    );
};

export default Settings; 