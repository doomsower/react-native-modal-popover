import React from 'react';
import debounce from 'lodash.debounce';
import {
  StyleSheet, Dimensions, Animated, Easing, TouchableWithoutFeedback, View, Modal,
  ViewStyle
} from 'react-native';
import { Geometry, Placement, Point, Rect, Size, computeGeometry } from './PopoverGeometry';

const styles = StyleSheet.create({
  container: {
    opacity: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  containerVisible: {
    opacity: 1,
  },
  background: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: '#f2f2f2',
  },
  dropShadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.8,
  },
  arrow: {
    position: 'absolute',
    borderTopColor: '#f2f2f2',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ArrowRotation: { [index: string]: string} = {
  bottom: '180deg',
  left: '-90deg',
  right: '90deg',
  top: '0deg',
  auto: '0deg',
};

export interface PopoverProps {
  isVisible?: boolean;
  onClose?: () => void;
  arrowSize: Size;
  placement: Placement;
  fromRect: Rect;
  displayArea: Rect;
  backgroundStyle?: ViewStyle;
  arrowStyle: ViewStyle;
  popoverStyle?: ViewStyle;
  contentStyle: ViewStyle;
}

export interface PopoverState extends Geometry {
  contentSize: Size;
  visible: boolean;
  isAwaitingShow: boolean;
  animations: {
    scale: Animated.Value;
    translate: Animated.ValueXY;
    fade: Animated.Value;
  };
}

interface LayoutCallback {
  (event: { nativeEvent: { layout: { x: number, y: number, width: number, height: number } } }): void;
}

export default class Popover extends React.Component<PopoverProps, PopoverState> {

  static defaultProps:Partial<PopoverProps> = {
    isVisible: false,
    onClose: () => {},
    displayArea: new Rect(10, 10, SCREEN_WIDTH - 20, SCREEN_HEIGHT - 20),
    arrowSize: new Size(16, 8),
    placement: 'auto',
  };

  constructor(props: PopoverProps) {
    super(props);
    this.state = {
      contentSize: new Size(0,0),
      anchor: new Point(0,0),
      origin: new Point(0,0),
      placement: props.placement || 'auto',
      visible: false,
      isAwaitingShow: false,
      animations: {
        scale: new Animated.Value(0),
        translate: new Animated.ValueXY({ x: 0, y: 0 }),
        fade: new Animated.Value(0),
      },
    };
  }

  private updateState = debounce(this.setState, 100);

  private measureContent:LayoutCallback = ({ nativeEvent: { layout: { width, height } } }) => {
    if (width && height) {
      const contentSize = { width, height };
      const geom = computeGeometry(contentSize, this.props.placement, this.props.fromRect, this.props.displayArea, this.props.arrowSize);

      const isAwaitingShow = this.state.isAwaitingShow;

      // Debounce to prevent flickering when displaying a popover with content
      // that doesn't show immediately.
      this.updateState(({ ...geom, contentSize }), () => {
        // Once state is set, call the showHandler so it can access all the geometry
        // from the state
        if (isAwaitingShow) {
          this.startAnimation(true);
        }
      });
    }
  };

  private getTranslateOrigin = () => {
    const { contentSize, origin, anchor } = this.state;
    const popoverCenter = new Point(origin.x + contentSize.width / 2, origin.y + contentSize.height / 2);
    return new Point(anchor.x - popoverCenter.x, anchor.y - popoverCenter.y);
  };

  componentWillReceiveProps(nextProps: PopoverProps) {
    const willBeVisible = nextProps.isVisible;
    const { isVisible, fromRect, displayArea } = this.props;

    if (willBeVisible !== isVisible) {
      if (willBeVisible) {
        // We want to start the show animation only when contentSize is known
        // so that we can have some logic depending on the geometry
        this.setState({ contentSize: new Size(0,0), isAwaitingShow: true, visible: true });
      } else {
        this.startAnimation(false);
      }
    } else if (willBeVisible && (fromRect !== nextProps.fromRect || displayArea !== nextProps.displayArea)) {
      const contentSize = this.state.contentSize;

      const geom = computeGeometry(contentSize, nextProps.placement, nextProps.fromRect, nextProps.displayArea, nextProps.arrowSize);

      const isAwaitingShow = this.state.isAwaitingShow;
      this.setState({ ...geom, contentSize }, () => {
        // Once state is set, call the showHandler so it can access all the geometry
        // from the state
        if (isAwaitingShow) {
          this.startAnimation(true);
        }
      });
    }
  }

  private startAnimation = (show: boolean) => {
    const values = this.state.animations;
    const translateOrigin = this.getTranslateOrigin();

    if (show) {
      values.translate.setValue(translateOrigin);
    }

    const commonConfig = {
      duration: 300,
      easing: show ? Easing.out(Easing.back(1.70158)) : Easing.inOut(Easing.quad),
      useNativeDriver: true,
    };

    const doneCallback = show ? undefined : () => this.setState({ visible: false });

    Animated.parallel([
      Animated.timing(values.fade, {
        toValue: show ? 1 : 0,
        ...commonConfig,
      }),
      Animated.timing(values.translate, {
        toValue: show ? new Point(0, 0) : translateOrigin,
        ...commonConfig,
      }),
      Animated.timing(values.scale, {
        toValue: show ? 1 : 0,
        ...commonConfig,
      }),
    ]).start(doneCallback);
  };

  private getElementStyles = () => {
    const { animations, anchor, origin, placement } = this.state;
    const arrowSize = this.props.arrowSize;

    // Create the arrow from a rectangle with the appropriate borderXWidth set
    // A rotation is then applied depending on the placement
    // Also make it slightly bigger
    // to fix a visual artifact when the popover is animated with a scale
    const width = arrowSize.width + 2;
    const height = arrowSize.height * 2 + 2;

    return {
      background: [
        this.props.backgroundStyle,
        {
          opacity: animations.fade.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
      ],
      arrow: [
        this.props.arrowStyle,
        {
          left: anchor.x - origin.x - width / 2,
          top: anchor.y - origin.y - height / 2,
          width,
          height,
          borderTopWidth: height / 2,
          borderRightWidth: width / 2,
          borderBottomWidth: height / 2,
          borderLeftWidth: width / 2,
          transform: [
            { rotate: ArrowRotation[placement] },
            {
              scale: animations.scale.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ],
      popover: this.props.popoverStyle,
      content: [
        this.props.contentStyle,
        {
          transform: [
            { translateX: animations.translate.x },
            { translateY: animations.translate.y },
            { scale: animations.scale },
          ],
        },
      ],
    };
  };

  render() {
    const { origin } = this.state;
    const elementStyles = this.getElementStyles();
    const contentContainerStyle = [styles.contentContainer, ...elementStyles.content];
    const arrowStyle = [styles.arrow, ...elementStyles.arrow];

    const contentSizeAvailable = this.state.contentSize.width;

    return (
      <Modal transparent visible={this.state.visible} onRequestClose={this.props.onClose}>
        <View style={[styles.container, contentSizeAvailable && styles.containerVisible]} collapsable={false}>
          <TouchableWithoutFeedback onPress={this.props.onClose}>
            <Animated.View style={[styles.background, ...elementStyles.background]} />
          </TouchableWithoutFeedback>
          <Animated.View style={[{ top: origin.y, left: origin.x }, elementStyles.popover]}>
            <Animated.View onLayout={this.measureContent} style={contentContainerStyle}>
              {this.props.children}
            </Animated.View>
            <Animated.View style={arrowStyle} />
          </Animated.View>
        </View>
      </Modal>
    );
  }

}
