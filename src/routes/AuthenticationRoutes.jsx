import { lazy } from 'react';

// project imports 
import Loadable from '../ui-component/Loadable';
import MinimalLayout from '../layout/MinimalLayout';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('../views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('../views/pages/authentication/Register')));
const VerifikasiNoHpPage = Loadable(lazy(() => import('../views/pages/authentication/VerifikasiNoHp')));
const VerifikasiOtpPage = Loadable(lazy(() => import('../views/pages/authentication/VerifikasiOtp')));
const PerbaruiPasswordPage = Loadable(lazy(() => import('../views/pages/authentication/PerbaruiPassword')));

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
      path: '/Verifikasi-otp',
      element: <VerifikasiOtpPage />
    },
    {
      path: '/Verifikasi-noHp',
      element: <VerifikasiNoHpPage />
    },
    {
      path: '/perbarui-password',
      element: <PerbaruiPasswordPage />
    },
  ]
};

export default AuthenticationRoutes;
