import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { ErrorStateProps } from '../types';

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Error: {error}</Text>
    <TouchableOpacity style={styles.button} onPress={onRetry}>
      <Text style={styles.buttonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

export default memo(ErrorState); 