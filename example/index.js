import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
// import Snoopy from 'rn-snoopy'
// import filter from 'rn-snoopy/stream/filter'
// import EventEmitter from 'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter';
//
// const events = Snoopy.stream(EventEmitter);
// filter({type: Snoopy.TO_NATIVE}, true)(events).subscribe();

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update');
//   whyDidYouUpdate(React)
// }

AppRegistry.registerComponent('example', () => App);
