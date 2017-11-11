import React from 'react';
import {findNodeHandle, NativeModules, StyleSheet, Text, View} from 'react-native';
import Button from './Button';
import Popover from './popover';

const styles = StyleSheet.create({
  app: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
    backgroundColor: '#c2ffd2',
    alignItems: 'center',
  },
});

export default class App2 extends React.Component {

  state = {
    showPopover: false,
    popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
  };

  setButton = (e) => {
    const handle = findNodeHandle(this.button);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({ popoverAnchor: { x, y, width, height } });
      });
    }
  };

  openPopover = () => {
    this.setState({ showPopover: true })
  };

  closePopover = () => this.setState({ showPopover: false });

  render() {
    return (
      <View style={styles.app}>
        <Button
          ref={r => {this.button = r}} icon="arrow-up" onPress={this.openPopover} onLayout={this.setButton}/>
        <Popover
          visible={this.state.showPopover}
          fromRect={this.state.popoverAnchor}
          onClose={this.closePopover}
          placement="bottom"
        >
          <Text>Hi</Text>
        </Popover>
      </View>
    );
  }
}
