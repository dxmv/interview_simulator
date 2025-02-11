import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Interview from './components/interview/Interview';
import AuthWrapper from './auth/AuthWrapper';

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
      }
    ]
  }
]);