import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import NewsCard from '@/app/index/news-card';
import Swappable from '@/components/swappable/swappable';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample data
  const newsData = [
    {
      id: '1',
      title: 'Sample News Title 1',
      content:
        'This is a sample news content that would appear in the Inshorts app...',
      imageUrl: 'https://via.placeholder.com/400x200',
      time: '15 minutes ago',
      author: 'John Doe',
      source: 'Sample News',
    },
    {
      id: '2',
      title: 'Sample News Title 2',
      content:
        'This is a sample news content that would appear in the Inshorts app...',
      imageUrl: 'https://via.placeholder.com/400x200',
      time: '20 minutes ago',
      author: 'John Doe',
      source: 'Sample News',
    },
    {
      id: '3',
      title: 'Sample News Title 3',
      content:
        'This is a sample news content that would appear in the Inshorts app...',
      imageUrl: 'https://via.placeholder.com/400x200',
      time: '30 minutes ago',
      author: 'John Doe',
      source: 'Sample News',
    },
    // Add more news items here
  ];
  let currentIndexInRange = currentIndex < 0 ? 0 : currentIndex;
  currentIndexInRange =
    currentIndexInRange >= newsData.length
      ? newsData.length - 1
      : currentIndexInRange;
  console.log({ currentIndexInRange });
  return (
    <View style={styles.container}>
      <Swappable
        onLeftSwipe={() => {
          console.log('Swipe left');
          setCurrentIndex(currentIndexInRange - 1);
        }}
        onRightSwipe={() => {
          setCurrentIndex(currentIndexInRange + 1);
          console.log('Swipe right ');
        }}
        onTopSwipe={() => {
          console.log('swipe top');
          setCurrentIndex(currentIndexInRange - 1);
        }}
        onBottomSwipe={() => {
          console.log('bottom swipe');
          setCurrentIndex(currentIndexInRange + 1);
        }}
        style={styles.card}
      >
        {' '}
        <NewsCard data={newsData[currentIndexInRange]} />
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
