import { StyleProp, ViewStyle } from 'react-native';

export interface ExampleProps {
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
