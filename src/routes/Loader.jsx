import Cookies from 'js-cookie';
import { redirect } from 'react-router-dom';

export const authLoader = () => {
  const token = Cookies.get('token');
  if (!token) {
    return redirect('/login');
  }
  return null;
};
