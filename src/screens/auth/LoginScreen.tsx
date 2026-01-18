import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../hooks/authHook';
import { Colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../types/navigation';
import { IconArrowLeft } from '@tabler/icons-react-native';

function LoginScreen() {
  const { singInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<AuthNavigationProp>();

  const handleSingIn = async () => {
    const { error } = await singInWithPassword(email, password);
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login in to your account</Text>
      <IconArrowLeft />
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
      <Button title="Sing In" onPress={handleSingIn} />
      <Button
        title="go to registration"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

export default LoginScreen;

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
