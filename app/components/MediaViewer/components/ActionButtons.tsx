import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { ActionButtonsProps } from '../types';

const ActionButtons: React.FC<ActionButtonsProps> = ({ onKeep, onDelete, disabled }) => (
  <View style={styles.actionButtons}>
    <TouchableOpacity
      style={[styles.actionButton, styles.deleteButton]}
      onPress={onDelete}
      disabled={disabled}
    >
      <Text style={styles.actionButtonText}>Delete</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.actionButton, styles.keepButton]}
      onPress={onKeep}
      disabled={disabled}
    >
      <Text style={styles.actionButtonText}>Keep</Text>
    </TouchableOpacity>
  </View>
);

export default memo(ActionButtons); 