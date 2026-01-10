import { useAuth } from '../hooks/authHook';
import { AuthNavigation } from '../navigation/AuthNavigation';

export function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) return <AuthNavigation />;
  return <></>;
}
