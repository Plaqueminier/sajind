import React, { memo } from 'react';
import { Image } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { styles } from '../styles/styles';
import { MediaCardProps } from '../types';

const MediaCard: React.FC<MediaCardProps> = ({ 
  uri, 
  panGesture, 
  animatedStyle 
}) => (
  <GestureDetector gesture={panGesture}>
    <Animated.View style={[styles.mediaContainer, animatedStyle]}>
      <Image
        source={{ uri }}
        style={styles.media}
        resizeMode="contain"
      />
    </Animated.View>
  </GestureDetector>
);

export default memo(MediaCard); 