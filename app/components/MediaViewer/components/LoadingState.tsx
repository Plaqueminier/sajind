import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';

const LoadingState: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Loading photos...</Text>
  </View>
);

export default memo(LoadingState); 