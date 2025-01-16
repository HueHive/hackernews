import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import NewsCard from '@/app/index/news-card';
import Swappable from '@/components/swappable/swappable';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data } = useQuery({
    queryKey: ['topStories'],
    queryFn: () =>
      fetch(
        'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
      ).then((res) => res.json()),
  });

  const topStories = data || [];

  if (topStories.length === 0) {
    return (
      <View>
        <Text>No data found</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Swappable
        onLeftSwipe={() => {
          // console.log('Swipe left');
          // setCurrentIndex(currentIndexInRange - 1);
        }}
        onRightSwipe={() => {
          // setCurrentIndex(currentIndexInRange + 1);
          // console.log('Swipe right ');
        }}
        onTopSwipe={() => {
          console.log('swipe top', currentIndex);
          setCurrentIndex(currentIndex + 1);
        }}
        onBottomSwipe={() => {
          console.log('bottom swipe', currentIndex);
          setCurrentIndex(Math.max(currentIndex - 1, 0));
        }}
        style={styles.card}
      >
        {' '}
        <NewsCard newsId={topStories[currentIndex]} />
      </Swappable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  card: {
    height: Dimensions.get('window').height,
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
    flex: 1,
  },
});
