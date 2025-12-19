import { RouterProvider } from 'react-router-dom';


// routing
import router from './routes';

// project imports
import NavigationScroll from './layout/NavigationScroll';

import ThemeCustomization from './themes';

import useAuthStore from './store/authStore';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
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
