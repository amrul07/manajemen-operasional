import { Navigate } from 'react-router-dom';
import useGlobalStore from '../store/globalStore';

export default function ProtectedRoute({ roles, children }) {
const role = useGlobalStore((state) => state.role);

  if (roles && !roles.includes(role)) {
    return <Navigate to="/403" />;
  }

  return children;
}
