import { Outlet, useLocation } from 'react-router-dom';
import SideNav from '../../components/navigation/SideNav';

const ProtectedLayout = () => {
  const location = useLocation();
  return (
    <div className="flex">
      {location.pathname !== '/cv-upload' && <SideNav />}
      <main className="flex-1 ml-[72px]">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout; 