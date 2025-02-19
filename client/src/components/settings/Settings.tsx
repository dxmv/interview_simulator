import { useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Sun, Moon } from 'lucide-react';
import AccountActions from './AccountActions';
import EmailSettings from './EmailSettings';
import PasswordSettings from './PasswordSettings';
import { useTheme } from '../../context/theme/ThemeContext';
/**
 * Settings component allows users to manage their account settings,
 * including email, password, theme, and voice preferences.
 */
const Settings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            {/* Email Settings */}
            <EmailSettings />

            <Separator className="my-6" />

            {/* Password Settings */}
            <PasswordSettings />

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