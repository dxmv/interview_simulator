import { useState } from 'react';
import { Button } from '../ui/button';
import { Trash2, LogOut } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { useNavigate } from 'react-router-dom';
import { useToken } from '../../context/auth/TokenContext';
import { deleteAccount } from '@/services/userServiceApi';

// Functional component for account actions
const AccountActions = () => {
    const navigate = useNavigate();
    const { logout,getToken } = useToken();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Function to handle user logout
    const handleLogout = () => {
        logout(); // Call logout function from context
        navigate('/login'); // Redirect to login page
    };

    // Function to handle account deletion
    const handleDeleteAccount = async () => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found');
            }
            await deleteAccount(token);
            setIsDeleteDialogOpen(false); // Close the delete confirmation dialog
            navigate('/register'); // Redirect to register page
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Account Actions</h2>
            <div className="flex gap-4">
                {/* Delete account dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="w-40"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete your account? This action cannot be undone.
                                All your data, including saved interviews and CV information, will be permanently deleted.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                            >
                                Delete Account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                {/* Logout button */}
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
    );
};

export default AccountActions; 