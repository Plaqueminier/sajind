import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';

const EmptyState: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No photos found in camera roll</Text>
  </View>
);

export default memo(EmptyState); 