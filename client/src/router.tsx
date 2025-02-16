import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Interview from './components/interview/Interview';
import CV_Page from './components/cv/CV_Page';
import StatsPage from './components/stats/StatsPage';
import AuthWrapper from './auth/AuthWrapper';
import ProtectedLayout from './auth/ProtectedLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      // Protected routes group
      {
        element: (
          <AuthWrapper>
            <ProtectedLayout />
          </AuthWrapper>
        ),
        children: [
          {
            path: '/',
            element: <Home />
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
    ]
  }
]);