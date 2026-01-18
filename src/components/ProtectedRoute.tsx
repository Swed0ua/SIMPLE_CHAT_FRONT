import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/authHook';
import { AuthNavigation } from '../navigation/AuthNavigation';

export function ProtectedRoute() {
  const { user, signOut } = useAuth();

  if (!user) return <AuthNavigation />;
  return (
    <>
      <TouchableOpacity onPress={() => signOut()} style={styles.signOutButton}>
        <Text style={{ color: 'white' }}>Sign Out</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 40,
    alignItems: 'center',
  },
});
