import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../hooks/authHook';
import { Colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../types/navigation';

function RegistrationScreen() {
  const { singUpWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<AuthNavigationProp>();

  const handleSingUp = async () => {
    const { error } = await singUpWithPassword(email, password);
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Registration</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={text => {
          setEmail(text.trim());
        }}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={text => {
          setPassword(text.trim());
        }}
      />
      <Button title="Sing Up" onPress={handleSingUp} />
      <Button
        title="you have an account? go to login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    gap: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border.default,
    padding: 10,
    borderRadius: 5,
  },
});
