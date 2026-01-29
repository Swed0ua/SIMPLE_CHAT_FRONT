import { useAuth } from '../hooks/authHook';
import { AuthNavigation } from '../navigation/AuthNavigation';
import { MainNavigation } from '../navigation/MainNavigation';

export function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) return <AuthNavigation />;
  return <MainNavigation />;
}
