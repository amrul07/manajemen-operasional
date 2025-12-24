import { Navigate } from 'react-router-dom';
import useGlobalStore from '../store/globalStore';

export default function ProtectedRoute({ roles, children }) {
const user = useGlobalStore((state) => state.user);

  if (roles && !roles.includes(user)) {
    return <Navigate to="/403" />;
  }

  return children;
}
