import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { Popover, PopoverController } from 'react-native-modal-popover';
import Button from './Button';

export interface PopoverExampleProps {
  width?: number;
  height?: number;
  icon: string;
  text: string;
  alignItems: ViewStyle['alignItems'];
  justifyContent: ViewStyle['justifyContent'];
  popoverStyles?: {
    backgroundStyle?: StyleProp<ViewStyle>;
    arrowStyle?: StyleProp<ViewStyle>;
    popoverStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
  };
}

export const PopoverExample: React.FC<PopoverExampleProps> = (props) => {
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
