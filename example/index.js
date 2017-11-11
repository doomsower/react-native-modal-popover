import { AppRegistry } from 'react-native';
import App from './src/App2';
// import Snoopy from 'rn-snoopy'
// import filter from 'rn-snoopy/stream/filter'
// import EventEmitter from 'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter';

// const events = Snoopy.stream(EventEmitter);
// filter({type: Snoopy.TO_NATIVE}, true)(events).subscribe();

AppRegistry.registerComponent('example', () => App);
