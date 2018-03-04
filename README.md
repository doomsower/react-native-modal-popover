# react-native-modal-popover
Pure JS popover component for react-native

![Android](https://raw.githubusercontent.com/doomsower/react-native-modal-popover/master/gifs/android.gif)
![iOS](https://raw.githubusercontent.com/doomsower/react-native-modal-popover/master/gifs/ios.gif)

## About this module
The original [react-native-popover](https://github.com/jeanregisser/react-native-popover) is now outdated,
so I decided to publish my own module to avoid using github url in my package.json. Something got lost in 
the process of rewriting, but now it uses `Modal` and native animation drivers, and also has cool helper 
to use with Touchables. Thanks to @jeanregisser and to the authors of hanging PRs for their code.

## Install
```sh
yarn add react-native-modal-popover
```

## Usage

This module exports two react components, `Popover` and `PopoverTouchable`. 
`Popover` works pretty much like original `Popover`, and `PopoverTouchable` is a nice wrapper.
Render it with two children - something with `onPress` and `Popover` and it'll manage the popover for you.

```jsx
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Popover, { PopoverTouchable } from 'react-native-modal-popover';

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
```

## Props

### `Popover`

Prop              | Type      | Optional | Default               | Description
----------------- | --------- | -------- | --------------------- | -----------
visible           | bool      | Yes      | false                 | Show/Hide the popover
fromRect          | Rect      | No*      |                       | Rectangle at which to anchor the popover. **Optional** when used inside `PopoverTouchable`, **required** when used standalone
displayArea       | Rect      | Yes      | Screen - 10px padding | Area where the popover is allowed to be displayed
placement         | string    | Yes      | 'auto'                | How to position the popover - top &#124; bottom &#124; left &#124; right &#124; auto. When 'auto' is specified, it will determine the ideal placement so that the popover is fully visible within `displayArea`.
onClose           | function  | Yes      |                       | Callback to be fired when the user closes the popover
backgroundStyle   | ViewStyle | Yes      |                       | Custom style to be applied to background overlay 
contentStyle      | ViewStyle | Yes      |                       | Custom style to be applied to popover reactangle. Use it to set round corners, background color, etc.
arrowStyle        | ViewStyle | Yes      |                       | Custom style to be applied to popover arrow. Use `borderTopColor` to match content backgroundColor
duration | number    | Yes      | 300 | Animation duration
easing | (show: boolean) => (value: number) => number| Yes | show => show ? Easing.out(Easing.back(1.70158)) : Easing.inOut(Easing.quad) | Function that returns easing function for show or hide animation, depending on `show` argument
useNativeDriver | bool | Yes | false | Defines if animations should use native driver

### `PopoverTouchable`

Prop                 | Type        | Optional | Default               | Description
-------------------- | ----------- | -------- | --------------------- | -----------
onPopoverDisplayed   | () => void  | Yes      |                       | Callback to be fired when touchable is pressed and popover is displayed.


### `Rect`

Rect is an object with the following properties: `{x: number, y: number, width: number, height: number}`

## Contributing

If you want to add some features, feel free to submit PR.




