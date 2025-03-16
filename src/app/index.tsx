import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import NewsCard from '@/components/home/news-card';
import Swappable from '@/components/swappable/swappable';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: topStories = [], isLoading } = useQuery({
    queryKey: ['topStories'],
    queryFn: () =>
      fetch(
        'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
      ).then((res) => res.json()),
  });

  if (isLoading) {
    return <ActivityIndicator size={'large'}></ActivityIndicator>;
  }

  if (topStories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No data found</Text>
      </View>
    );
  }

  return (
    <Swappable
      onLeftSwipe={() => {
        // console.log('Swipe left');
        // setCurrentIndex(currentIndexInRange - 1);
      }}
      onRightSwipe={() => {
        // setCurrentIndex(currentIndexInRange + 1);
        // console.log('Swipe right ');
        console.log('hellow man ');
        router.push({
          pathname: '/news',
          params: { newsUrl: 'https://keepworking.github.io/nash/' },
        });
      }}
      onTopSwipe={() => {
        setCurrentIndex(currentIndex + 1);
      }}
      onBottomSwipe={() => {
        setCurrentIndex(Math.max(currentIndex - 1, 0));
      }}
      className="flex-1"
    >
      <NewsCard newsId={topStories[currentIndex]} />
    </Swappable>
  );
}
