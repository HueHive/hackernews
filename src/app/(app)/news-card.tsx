import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { type News } from './types';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.8;
interface NewsCardProps {
  data: News;
  index: number;
  onSwipeComplete: (index: number) => void;
}
const NewsCard = ({ data, index, onSwipeComplete }: NewsCardProps) => {
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
          onSwipeComplete(index + 1);
          setDirection(undefined);
        });
      } else if (gesture.dy > 50 && direction === 'bottom') {
        Animated.timing(position, {
          toValue: { x: 0, y: SCREEN_HEIGHT },
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onSwipeComplete(index - 1);
          setDirection(undefined);
        });
      } else if (gesture.dx > 50 && direction === 'right') {
        Animated.timing(position, {
          toValue: { x: SCREEN_WIDTH, y: 0 },
          useNativeDriver: true,
        }).start(() => {
          onSwipeComplete(index + 1);
          setDirection(undefined);
        });
      } else if (gesture.dx < -50 && direction === 'left') {
        Animated.timing(position, {
          toValue: { x: -SCREEN_WIDTH, y: 0 },
          useNativeDriver: true,
        }).start(() => {
          onSwipeComplete(index - 1);
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
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.card, cardStyle]}
    >
      <Image source={{ uri: data.imageUrl }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.time}>{data.time}</Text>
        <Text style={styles.content}>{data.content}</Text>
        <View style={styles.sourceContainer}>
          <Text style={styles.source}>short by {data.author}</Text>
          <Text style={styles.divider}>|</Text>
          <Text style={styles.source}>{data.source}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  image: {
    height: CARD_HEIGHT * 0.4,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  contentContainer: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  time: {
    color: '#666',
    fontSize: 12,
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  source: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    marginHorizontal: 5,
    color: '#666',
  },
});

export default NewsCard;
