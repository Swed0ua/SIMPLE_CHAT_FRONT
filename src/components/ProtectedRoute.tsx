import { useAuth } from '../hooks/authHook';
import AuthScreen from '../screens/AuthScreen';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <AuthScreen />;
  return <>{children}</>;
}
