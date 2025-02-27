import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { PermissionRequestProps } from '../types';

const PermissionRequest: React.FC<PermissionRequestProps> = ({ onRequestPermission }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Please grant camera roll permissions</Text>
    <TouchableOpacity
      style={styles.button}
      onPress={onRequestPermission}
    >
      <Text style={styles.buttonText}>Grant Permission</Text>
    </TouchableOpacity>
  </View>
);

export default memo(PermissionRequest); 