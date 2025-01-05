import React, { type ReactNode, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  type PanResponderGestureState,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const getAnimationCoordinate = function (
  gesture: PanResponderGestureState,
  swipeDirection: 'left' | 'right' | 'top' | 'bottom' | undefined,
) {
  switch (true) {
    case gesture.dy < -50 && swipeDirection === 'top':
      return { x: 0, y: -SCREEN_HEIGHT };
    case gesture.dy > 50 && swipeDirection === 'bottom':
      return { x: 0, y: SCREEN_HEIGHT };
    case gesture.dx > 50 && swipeDirection === 'right':
      return { x: SCREEN_WIDTH, y: 0 };
    case gesture.dx < -50 && swipeDirection === 'left':
      return { x: -SCREEN_WIDTH, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};
interface SwappableProps {
  children: ReactNode;
  onLeftSwipe: Function;
  onRightSwipe: Function;
  onTopSwipe: Function;
  onBottomSwipe: Function;
  style: StyleProp<ViewStyle>;
}
const Swappable = ({
  children,
  onLeftSwipe,
  onRightSwipe,
  onTopSwipe,
  onBottomSwipe,
  style,
}: SwappableProps) => {
  const [swipeDirection, setSwipeDirection] = useState<
    'right' | 'left' | 'top' | 'bottom' | undefined
  >();
  const position = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (
        (Math.abs(gesture.dx) > 20 || Math.abs(gesture.dy) > 20) &&
        swipeDirection === undefined
      ) {
        if (gesture.dx < -20) setSwipeDirection('left');

        if (gesture.dx > 20) setSwipeDirection('right');

        if (gesture.dy < -20) setSwipeDirection('top');

        if (gesture.dy > 20) setSwipeDirection('bottom');
      }
      if (swipeDirection === 'top') position.setValue({ x: 0, y: gesture.dy });
      if (swipeDirection === 'bottom')
        position.setValue({ x: 0, y: gesture.dy });
      if (swipeDirection === 'left') position.setValue({ x: gesture.dx, y: 0 });
      if (swipeDirection === 'right')
        position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      return Animated.timing(position, {
        toValue: getAnimationCoordinate(gesture, swipeDirection),
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        switch (swipeDirection) {
          case 'top':
            onTopSwipe();
            break;
          case 'bottom':
            onBottomSwipe();
            break;
          case 'left':
            onLeftSwipe();
            break;
          case 'right':
            onRightSwipe();
            break;
        }
        setSwipeDirection(undefined);
      });
    },
  });

  const cardStyle = {
    transform: position.getTranslateTransform(),
  };

  return (
    <Animated.View {...panResponder.panHandlers} style={[style, cardStyle]}>
      {children}
    </Animated.View>
  );
};

export default Swappable;
