import { RouterProvider } from 'react-router-dom';

// routing
import router from './routes';

// project imports
import NavigationScroll from './layout/NavigationScroll';

import ThemeCustomization from './themes';

import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      alert(payload.notification?.title + '\n' + payload.notification?.body);
    });
  }, []);
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
