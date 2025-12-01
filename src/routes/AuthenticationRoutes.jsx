import { lazy } from 'react';

// project imports 
import Loadable from '../ui-component/Loadable';
import MinimalLayout from '../layout/MinimalLayout';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('../views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('../views/pages/authentication/Register')));
const LupaPasswordPage = Loadable(lazy(() => import('../views/pages/authentication/LupaPassword')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/lupa-password',
      element: <LupaPasswordPage />
    },
  ]
};

export default AuthenticationRoutes;
