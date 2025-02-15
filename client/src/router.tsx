import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Interview from './components/interview/Interview';
import CV_Page from './components/cv/CV_Page';
import StatsPage from './components/stats/StatsPage';
import AuthWrapper from './auth/AuthWrapper';

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
      // Protected routes
      {
        path: '/',
        element: (
          <AuthWrapper>
            <Home />
          </AuthWrapper>
        )
      },
      {
        path: '/interview',
        element: (
          <AuthWrapper>
            <Interview />
          </AuthWrapper>
        )
      },
      {
        path: '/cv',
        element: (
          <AuthWrapper>
            <CV_Page />
          </AuthWrapper>
        )
      },
      {
        path: '/stats',
        element: (
          <AuthWrapper>
            <StatsPage />
          </AuthWrapper>
        )
      }
    ]
  }
]);