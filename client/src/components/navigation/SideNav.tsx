import { Home, BarChart2, User, Settings, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SideNav = () => {
    // State to manage the expansion of the side navigation
    const [isExpanded, setIsExpanded] = useState(false);
    // Hook to get the current location for active link styling
    const location = useLocation();

    // Array of navigation items with their respective icons, labels, and paths
    const navItems = [
        { icon: <Home size={24} />, label: "Home", path: "/" },
        { icon: <BarChart2 size={24} />, label: "Stats", path: "/stats" },
        { icon: <User size={24} />, label: "Profile", path: "/cv" },
        { icon: <Settings size={24} />, label: "Settings", path: "/settings" },
        { icon: <Plus size={24} />, label: "New Interview", path: "/interview", end: true, different: true },
    ];

    return (
        <nav 
            className="fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out"
            style={{ width: isExpanded ? "200px" : "72px" }}
            // Expand the nav on mouse enter and collapse on mouse leave
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex flex-col gap-2 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 p-2 rounded-lg transition-colors
                            ${location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-800'} ${item.different ? 'bg-blue-800' : ''} ${item.end ? 'align-self-end' : ''}`}
                    >
                        <span className="min-w-[24px]">{item.icon}</span>
                        <span 
                            className={`whitespace-nowrap transition-opacity duration-300
                                ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default SideNav; 