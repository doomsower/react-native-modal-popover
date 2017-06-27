import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: '#3b5998',
    borderRadius: 4,
  },
})

class Button extends React.PureComponent {
  render() {
    const { icon, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Icon name={icon} color="white" />
      </TouchableOpacity>
    );
  }
};

export default Button;
