declare module 'react-native-canvas' {
  import { Component } from 'react';
  import { ViewStyle, GestureResponderEvent } from 'react-native';
  
  export interface CanvasProps {
    ref?: any;
    style?: ViewStyle;
    onTouchStart?: (event: GestureResponderEvent) => void;
    onTouchMove?: (event: GestureResponderEvent) => void;
    onTouchEnd?: (event: GestureResponderEvent) => void;
  }

  export default class Canvas extends Component<CanvasProps> {}
}
