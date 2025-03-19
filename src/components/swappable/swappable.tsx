import React, {
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from 'react';
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

const getPositionBaseOnSwipeDirection = function (
  gesture: PanResponderGestureState,
  swipeDirection: 'left' | 'right' | 'top' | 'bottom' | undefined,
) {
  switch (swipeDirection) {
    case 'top':
    case 'bottom':
      return { x: 0, y: gesture.dy };

    case 'left':
    case 'right':
      return { x: gesture.dx, y: 0 };
    default:
      return { x: gesture.dx, y: gesture.dy };
  }
};
export interface SwappableProps<T> {
  children: ReactNode;
  onLeftSwipe: (data: T) => void;
  onRightSwipe: (data: T) => void;
  onTopSwipe: (data: T) => void;
  onBottomSwipe: (data: T) => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

type ChildRefType<T> = {
  getData: () => T;
};

const Swappable = function <T>({
  children,
  onLeftSwipe,
  onRightSwipe,
  onTopSwipe,
  onBottomSwipe,
  style,
  className,
}: SwappableProps<T | undefined>) {
  const childRef = useRef<ChildRefType<T>>();
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
        if (gesture.dx < -20) setSwipeDirection('right');
        if (gesture.dx > 20) setSwipeDirection('left');
        if (gesture.dy < -20) setSwipeDirection('top');
        if (gesture.dy > 20) setSwipeDirection('bottom');
      }
      position.setValue(
        getPositionBaseOnSwipeDirection(gesture, swipeDirection),
      );
    },
    onPanResponderRelease: (_, gesture) => {
      return Animated.timing(position, {
        toValue: getAnimationCoordinate(gesture, swipeDirection),
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        const dataFromChild = childRef.current?.getData();
        switch (swipeDirection) {
          case 'top':
            onTopSwipe(dataFromChild);
            break;
          case 'bottom':
            onBottomSwipe(dataFromChild);
            break;
          case 'left':
            onLeftSwipe(dataFromChild);
            break;
          case 'right':
            onRightSwipe(dataFromChild);
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
    <Animated.View
      {...panResponder.panHandlers}
      style={[style, cardStyle]}
      testID="swappable"
      className={className}
    >
      {React.isValidElement(children) &&
        React.cloneElement(children as ReactElement, { ref: childRef })}
    </Animated.View>
  );
};

export default Swappable;
