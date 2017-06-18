import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  View,
  Modal,
  ViewStyle,
} from 'react-native';
import { Geometry, Placement, Rect, Size, computeGeometry } from './PopoverGeometry';
const debounce = require('lodash.debounce');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject as any,
    opacity: 0,
    backgroundColor: 'transparent',
  },
  containerVisible: {
    opacity: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: '#f2f2f2',
    padding: 8,
  },
  shadow: {
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

const ArrowRotation: { [index: string]: number } = {
  bottom: 2,
  left: -1,
  right: 1,
  top: 0.0,
  auto: 0.0,
};

export interface PopoverProps {
  visible?: boolean;
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
    rotate: Animated.Value;
  };
}

interface LayoutCallback {
  (event: { nativeEvent: { layout: { x: number, y: number, width: number, height: number } } }): void;
}

export default class Popover extends React.Component<PopoverProps, PopoverState> {

  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    arrowSize: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    placement: PropTypes.oneOf(['left', 'top', 'right', 'bottom', 'auto']),
    fromRect: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    displayArea: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    backgroundStyle: PropTypes.any,
    arrowStyle: PropTypes.any,
    popoverStyle: PropTypes.any,
    contentStyle: PropTypes.any,
  };

  static defaultProps: Partial<PopoverProps> = {
    visible: false,
    onClose: () => {
    },
    displayArea: { x: 10, y: 10, width: SCREEN_WIDTH - 20, height: SCREEN_HEIGHT - 20 },
    arrowSize: { width: 16, height: 8 },
    placement: 'auto',
  };

  static displayName = 'Popover';

  constructor(props: PopoverProps) {
    super(props);
    this.state = {
      contentSize: { width: 0, height: 0 },
      anchor: { x: 0, y: 0 },
      origin: { x: 0, y: 0 },
      placement: props.placement || 'auto',
      visible: false,
      isAwaitingShow: false,
      animations: {
        scale: new Animated.Value(0),
        translate: new Animated.ValueXY({ x: 0, y: 0 }),
        fade: new Animated.Value(0),
        rotate: new Animated.Value(0),
      },
    };
  }

  private updateState = debounce(this.setState, 100);

  private measureContent: LayoutCallback = ({ nativeEvent: { layout: { width, height } } }) => {
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
    const popoverCenter = { x: origin.x + contentSize.width / 2, y: origin.y + contentSize.height / 2 };
    return { x: anchor.x - popoverCenter.x, y: anchor.y - popoverCenter.y };
  };

  componentWillReceiveProps(nextProps: PopoverProps) {
    const willBeVisible = nextProps.visible;
    const { visible, fromRect, displayArea } = this.props;

    if (willBeVisible !== visible) {
      if (willBeVisible) {
        // We want to start the show animation only when contentSize is known
        // so that we can have some logic depending on the geometry
        this.setState({ contentSize: { width: 0, height: 0 }, isAwaitingShow: true, visible: true });
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
      values.rotate.setValue(ArrowRotation[this.state.placement]);
    }

    const commonConfig = {
      duration: 300,
      easing: show ? Easing.out(Easing.back(1.70158)) : Easing.inOut(Easing.quad),
      useNativeDriver: true,
    };

    const doneCallback = show ? undefined : () => this.setState({ visible: false });

    Animated.parallel([
      // Workaround - fake animated value
      Animated.timing(values.rotate, {
        toValue: ArrowRotation[this.state.placement],
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(values.fade, {
        toValue: show ? 1 : 0,
        ...commonConfig,
      }),
      Animated.timing(values.translate, {
        toValue: show ? { x: 0, y: 0 } : translateOrigin,
        ...commonConfig,
      }),
      Animated.timing(values.scale, {
        toValue: show ? 1 : 0,
        ...commonConfig,
      }),
    ]).start(doneCallback);
  };

  private computeStyles = () => {
    const { animations, anchor, origin } = this.state;
    const arrowSize = this.props.arrowSize;

    // Create the arrow from a rectangle with the appropriate borderXWidth set
    // A rotation is then applied depending on the placement
    // Also make it slightly bigger
    // to fix a visual artifact when the popover is animated with a scale
    const width = arrowSize.width + 2;
    const height = arrowSize.height * 2 + 2;

    return {
      background: [
        styles.background,
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
        styles.arrow,
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
            // This is workaround for https://github.com/facebook/react-native/issues/14161
            // Instead of setting rotate to fixed value, I have to keep it as animated
            {
              rotate: animations.rotate.interpolate({
                inputRange: [-2, 2],
                outputRange: ['-180deg', '180deg'],
                extrapolate: 'clamp',
              }),
            },
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
      popover: [
        this.props.popoverStyle,
      ],
      content: [
        styles.shadow,
        styles.content,
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
    const computedStyles = this.computeStyles();
    const contentSizeAvailable = this.state.contentSize.width;
    return (
      <Modal transparent visible={this.state.visible} onRequestClose={this.props.onClose}>
        <View style={[styles.container, contentSizeAvailable && styles.containerVisible]}>

          <TouchableWithoutFeedback onPress={this.props.onClose}>
            <Animated.View style={computedStyles.background} />
          </TouchableWithoutFeedback>

          <Animated.View style={[{ top: origin.y, left: origin.x }, computedStyles.popover]}>
            <Animated.View onLayout={this.measureContent} style={computedStyles.content}>
              {this.props.children}
            </Animated.View>
            <Animated.View style={computedStyles.arrow} />
          </Animated.View>

        </View>
      </Modal>
    );
  }

}
