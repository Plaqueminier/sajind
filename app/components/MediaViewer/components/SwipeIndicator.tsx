import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';
import { SwipeIndicatorProps } from '../types';

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ swipeState }) => (
  <View style={styles.swipeIndicatorContainer}>
    {swipeState === "keep" && (
      <Text style={[styles.swipeIndicator, styles.keepIndicator]}>
        KEEP
      </Text>
    )}
    {swipeState === "delete" && (
      <Text style={[styles.swipeIndicator, styles.deleteIndicator]}>
        DELETE
      </Text>
    )}
  </View>
);

export default memo(SwipeIndicator); 