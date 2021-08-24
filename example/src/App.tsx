import { useLayout } from '@react-native-community/hooks';
import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PopoverControllerExample } from './PopoverControllerExample';
import { ExampleProps } from './types';
import { PopoverHookExample } from './PopoverHookExample';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c2ffd2',
  },
  app: {
    margin: 10,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const cenralPopoverStyles = StyleSheet.create({
  contentStyle: {
    padding: 16,
    backgroundColor: 'pink',
    borderRadius: 8,
  },
  arrowStyle: {
    borderTopColor: 'pink',
  },
  backgroundStyle: {
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
});

const examples: ExampleProps[] = [
  {
    icon: 'arrow-top-left',
    text: 'I am top-left popover',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  {
    icon: 'arrow-up',
    text: 'I am top-middle popover',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  {
    icon: 'arrow-top-right',
    text: 'I am top-right popover',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  {
    icon: 'arrow-left',
    text: 'I am middle-left popover',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  {
    icon: 'image-filter-center-focus',
    text: 'I am middle-middle popover.\nI am stylish!',
    alignItems: 'center',
    justifyContent: 'center',
    popoverStyles: cenralPopoverStyles,
  },
  {
    icon: 'arrow-right',
    text: 'I am middle-right popover',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  {
    icon: 'arrow-bottom-left',
    text: 'I am bottom-left popover',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  {
    icon: 'arrow-down',
    text: 'I am bottom-middle popover',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  {
    icon: 'arrow-bottom-right',
    text: 'I am bottom-right popover',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
];

const App: React.FC = () => {
  const { width, height, onLayout } = useLayout();

  // Change commented line to see different example
  const Example = PopoverHookExample;
  // const Example = PopoverControllerExample;

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <View style={styles.app} onLayout={onLayout}>
          {examples.map((example) => (
            <Example
              width={width / 3}
              height={height / 3}
              key={example.icon}
              {...example}
            />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
