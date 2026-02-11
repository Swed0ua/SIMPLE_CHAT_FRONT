import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { MainStackParamList } from '../../types/navigation';
import { ROUTES } from '../../navigation/routesConfig';

type ChatDetailsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  typeof ROUTES.ChatDetails
>;

export default function ChatDetailsScreen({
  route,
  navigation: _navigation,
}: ChatDetailsScreenProps) {
  const chatId = route.params.chatId;
  console.log('ChatDetailsScreen', chatId);
  return (
    <View>
      <Text>Hello world</Text>
      <Text>Chat Details {chatId}</Text>
    </View>
  );
}
