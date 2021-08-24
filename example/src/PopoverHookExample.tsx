import React from 'react';
import { Text, View } from 'react-native';
import { Popover, usePopover } from 'react-native-modal-popover';
import Button from './Button';
import { ExampleProps } from './types';

export const PopoverHookExample: React.FC<ExampleProps> = (props) => {
  const {
    width,
    height,
    icon,
    text,
    alignItems,
    justifyContent,
    popoverStyles,
  } = props;
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  return (
    <View style={{ width, height, alignItems, justifyContent }}>
      <Button icon={icon} ref={touchableRef} onPress={openPopover} />
      <Popover
        {...popoverStyles}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        supportedOrientations={['portrait', 'landscape']}>
        <Text>{text}</Text>
      </Popover>
    </View>
  );
};
