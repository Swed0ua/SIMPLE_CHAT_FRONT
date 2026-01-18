import React from 'react';
import { useAppSelector } from '../store/store';
import { Dimensions, Text, View } from 'react-native';

export default function LoadingOverlay() {
  const isLoading = useAppSelector(state => state.app.loading);
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const WINDOW_HEIGHT = Dimensions.get('window').height;

  if (!isLoading) return null;

  return (
    <View
      style={{
        postion: 'absolute',
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 37, 37, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Loading...</Text>
    </View>
  );
}
