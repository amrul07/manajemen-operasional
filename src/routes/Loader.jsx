import Cookies from 'js-cookie';
import { redirect } from 'react-router-dom';


export const authLoader = () => {
  const token = Cookies.get('token');
  // jika tidak ada token maka di arahkan ke halaman login
  if (!token) {
    return redirect('/login');
  }

  return null;
};
