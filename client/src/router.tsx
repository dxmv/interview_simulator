import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Interview from './components/interview/Interview';
import AuthWrapper from './auth/AuthWrapper';
import CV_Page from './components/cv/CV_Page';
import StatsPage from './components/stats/StatsPage';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <AuthWrapper><Login /></AuthWrapper>
      },
      {
        path: '/register',
        element: <AuthWrapper><Register /></AuthWrapper>
      },
      {
        path: '/interview',
        element: <Interview />
      },
      {
        path: '/cv',
        element: <CV_Page />
      },
      {
        path: '/stats',
        element: <StatsPage />
      }
    ]
  }
]);