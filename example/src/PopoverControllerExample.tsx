import React from 'react';
import { Text, View } from 'react-native';
import { Popover, PopoverController } from 'react-native-modal-popover';
import Button from './Button';
import { ExampleProps } from './types';

export const PopoverControllerExample: React.FC<ExampleProps> = (props) => {
  const {
    width,
    height,
    icon,
    text,
    alignItems,
    justifyContent,
    popoverStyles,
  } = props;

  return (
    <View style={{ width, height, alignItems, justifyContent }}>
      <PopoverController>
        {({
          openPopover,
          closePopover,
          popoverVisible,
          setPopoverAnchor,
          popoverAnchorRect,
        }) => (
          <React.Fragment>
            <Button icon={icon} ref={setPopoverAnchor} onPress={openPopover} />
            <Popover
              {...popoverStyles}
              visible={popoverVisible}
              onClose={closePopover}
              fromRect={popoverAnchorRect}
              supportedOrientations={['portrait', 'landscape']}>
              <Text>{text}</Text>
            </Popover>
          </React.Fragment>
        )}
      </PopoverController>
    </View>
  );
};
