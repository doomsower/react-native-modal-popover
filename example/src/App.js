import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Popover, { PopoverTouchable } from './popover';

const styles = StyleSheet.create({
  app: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2ffd2',
  },
  content: {
    padding: 16,
    backgroundColor: 'pink',
    borderRadius: 8,
  },
  arrow: {
    borderTopColor: 'pink',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 255, 0.5)'
  },
});

const App = () => (
  <View style={styles.app}>
    <PopoverTouchable onPopoverDisplayed={() => console.log('Popover displayed!')}>
      <Button title="Press me!" onPress={() => console.log('I don\'t work')}/>
      <Popover
        contentStyle={styles.content}
        arrowStyle={styles.arrow}
        backgroundStyle={styles.background}
      >
        <Text>Hello from inside popover!</Text>
      </Popover>
    </PopoverTouchable>
  </View>
);

export default App;
