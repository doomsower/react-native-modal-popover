import React from 'react';
import { Dimensions, Platform, StyleSheet, StatusBar, Text, View } from 'react-native';
import Popover, { PopoverTouchable } from './popover';
import Button from './Button';

const window = Dimensions.get('window');
const width = (window.width - 20) / 3;
const height = (window.height - 40) / 3;

const PopoverExample = ({ icon, text, alignItems, justifyContent, popoverStyles }) => (
  <View style={{ width, height, alignItems, justifyContent }}>
    <PopoverTouchable onPopoverDisplayed={() => console.log(text)}>
      <Button icon={icon} onPress={() => console.log('I don\'t work')}/>
      <Popover {...popoverStyles}>
        <Text>{text}</Text>
      </Popover>
    </PopoverTouchable>
  </View>
);

export default PopoverExample;
