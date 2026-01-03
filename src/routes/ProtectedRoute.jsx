import { Navigate } from 'react-router-dom';
import useGlobalStore from '../store/globalStore';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ roles, children }) {
  const role = useGlobalStore((state) => state.role);
  const token = useAuthStore((state) => state.token);

  // 🔴 BELUM LOGIN
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 SUDAH LOGIN TAPI ROLE TIDAK SESUAI
  if (roles && !roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
