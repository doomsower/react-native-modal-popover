import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Popover from './popover/Popover';

const styles = StyleSheet.create({
  app: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2ffd2',
  },
  button: {
    backgroundColor: '#a4a4ff',
    padding: 8,
  },
});

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPopover: false,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
    };
    this._button = null;
  }

  setButtonRef = (ref) => { this._button = ref; };

  onPress = () => {
    this._button.measure((_x, _y, width, height, x, y) => {
      this.setState({
        showPopover: true,
        popoverAnchor: { x, y, width, height },
      });
    });
  };

  onClosePopover = () => this.setState({ showPopover: false });

  render () {
    return (
      <View style={styles.app}>
        <TouchableOpacity ref={this.setButtonRef} onPress={this.onPress} style={styles.button}>
          <Text>Press me!</Text>
        </TouchableOpacity>
        <Popover
          isVisible={this.state.showPopover}
          onClose={this.onClosePopover}
          fromRect={this.state.popoverAnchor}
        >
          <Text>Hello from inside popover!</Text>
        </Popover>
      </View>
    );
  };
}

export default App;
