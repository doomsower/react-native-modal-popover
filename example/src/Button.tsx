import React, { forwardRef } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: '#3b5998',
    borderRadius: 4,
  },
});

interface Props {
  icon: string;
  onPress?: () => void;
  onLayout?: (e: LayoutChangeEvent) => void;
}

const Button = forwardRef<TouchableOpacity, Props>(
  ({ icon, onPress, onLayout }, ref) => (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      style={styles.button}
      onLayout={onLayout}>
      <Icon name={icon} color="white" />
    </TouchableOpacity>
  ),
);

export default Button;
