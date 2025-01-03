import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import NewsCard from '@/components/news-card';

export default function Feed() {
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

  const handleSwipeComplete = (newIndex: number) => {
    setCurrentIndex(newIndex > 0 ? newIndex % 2 : 0);
  };

  console.log('check index', currentIndex);

  return (
    <View style={styles.container}>
      return (
      <NewsCard
        data={newsData[currentIndex]}
        index={currentIndex}
        onSwipeComplete={handleSwipeComplete}
      />
      );
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
});
