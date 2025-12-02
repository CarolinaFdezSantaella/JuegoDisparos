declare module 'react-native-canvas' {
  import { Component } from 'react';
  
  export interface CanvasProps {
    ref?: any;
    style?: any;
    onTouchStart?: (event: any) => void;
    onTouchMove?: (event: any) => void;
    onTouchEnd?: (event: any) => void;
  }

  export default class Canvas extends Component<CanvasProps> {}
}
