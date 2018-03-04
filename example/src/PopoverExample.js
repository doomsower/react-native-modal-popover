import React from 'react';
import { Dimensions, Platform, StyleSheet, StatusBar, Text, View } from 'react-native';
import Popover, { PopoverTouchable } from './popover';
import Button from './Button';

class PopoverExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getState(Dimensions.get('window'));
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onDimensionsChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  getState = ({ width, height }) => {
    const [dw, dh] = width > height ? [20, 40] : [40, 20];
    return {
      width: (width - dw) / 3,
      height: (height - dh) / 3,
    };
  }
  
  onDimensionsChange = ({ window }) => {
    this.setState(this.getState(window));
  }

  render() {
    const { width, height } = this.state;
    const { icon, text, alignItems, justifyContent, popoverStyles } = this.props;
    return (
      <View style={{ width, height, alignItems, justifyContent }}>
        <PopoverTouchable onPopoverDisplayed={() => console.log(text)}>
          <Button icon={icon} onPress={() => console.log('I don\'t work')}/>
          <Popover {...popoverStyles} supportedOrientations={['portrait', 'landscape']}>
            <Text>{text}</Text>
          </Popover>
        </PopoverTouchable>
      </View>
    );
  }
}

export default PopoverExample;
