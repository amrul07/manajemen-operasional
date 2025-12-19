import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

// routing
import router from './routes';

// project imports
import NavigationScroll from './layout/NavigationScroll';

import ThemeCustomization from './themes';

import useAuthStore from './store/authStore';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const isTokenReady = useAuthStore((s) => s.isTokenReady);
  const token = useAuthStore((s) => s.token);


  useEffect(() => {
    initAuth(); // 🔥 baca cookie → store
  }, [initAuth]);

  // ⛔ JANGAN render router sebelum token siap
  if (!isTokenReady) {
    return null; // atau loader / splash
  }
  return (
    <ThemeCustomization>
      <NavigationScroll>
        <>
          <RouterProvider router={router} />
        </>
      </NavigationScroll>
    </ThemeCustomization>
  );
}
