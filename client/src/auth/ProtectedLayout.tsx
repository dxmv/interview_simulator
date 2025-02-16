import { Outlet } from 'react-router-dom';
import SideNav from '../components/navigation/SideNav';

const ProtectedLayout = () => {
  return (
    <div className="flex">
      <SideNav />
      <main className="flex-1 ml-[72px]">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout; 