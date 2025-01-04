import React, { type ReactNode, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
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
  const [direction, setDirection] = useState<
    'right' | 'left' | 'top' | 'bottom' | undefined
  >();
  const position = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (
        (Math.abs(gesture.dx) > 20 || Math.abs(gesture.dy) > 20) &&
        direction === undefined
      ) {
        if (gesture.dx < -20) setDirection('left');

        if (gesture.dx > 20) setDirection('right');

        if (gesture.dy < -20) setDirection('top');

        if (gesture.dy > 20) setDirection('bottom');
      }
      if (direction === 'top') position.setValue({ x: 0, y: gesture.dy });
      if (direction === 'bottom') position.setValue({ x: 0, y: gesture.dy });
      if (direction === 'left') position.setValue({ x: gesture.dx, y: 0 });
      if (direction === 'right') position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -50 && direction === 'top') {
        Animated.timing(position, {
          toValue: { x: 0, y: -SCREEN_HEIGHT },
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onTopSwipe();
          setDirection(undefined);
        });
      } else if (gesture.dy > 50 && direction === 'bottom') {
        Animated.timing(position, {
          toValue: { x: 0, y: SCREEN_HEIGHT },
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onBottomSwipe();
          setDirection(undefined);
        });
      } else if (gesture.dx > 50 && direction === 'right') {
        Animated.timing(position, {
          toValue: { x: SCREEN_WIDTH, y: 0 },
          useNativeDriver: true,
        }).start(() => {
          onRightSwipe();
          setDirection(undefined);
        });
      } else if (gesture.dx < -50 && direction === 'left') {
        Animated.timing(position, {
          toValue: { x: -SCREEN_WIDTH, y: 0 },
          useNativeDriver: true,
        }).start(() => {
          onLeftSwipe();
          setDirection(undefined);
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
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
