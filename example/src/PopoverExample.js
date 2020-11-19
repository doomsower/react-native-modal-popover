import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import Popover, {PopoverController} from 'react-native-modal-popover';
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

  getState = ({width, height}) => {
    const [dw, dh] = width > height ? [40, 20] : [20, 40];
    return {
      width: (width - dw) / 3,
      height: (height - dh) / 3,
    };
  };

  onDimensionsChange = ({window}) => {
    this.setState(this.getState(window));
  };

  render() {
    const {width, height} = this.state;
    const {icon, text, alignItems, justifyContent, popoverStyles} = this.props;
    return (
      <View style={{width, height, alignItems, justifyContent}}>
        <PopoverController>
          {({
            openPopover,
            closePopover,
            popoverVisible,
            setPopoverAnchor,
            popoverAnchorRect,
          }) => (
            <React.Fragment>
              <Button
                icon={icon}
                ref={setPopoverAnchor}
                onPress={openPopover}
              />
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
  }
}

export default PopoverExample;
