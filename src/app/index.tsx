import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, ToastAndroid, View } from 'react-native';

import NewsCard from '@/components/home/news-card';
import Swappable from '@/components/swappable/swappable';
import { type News } from '@/types';

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
    <Swappable<News>
      onLeftSwipe={(childData) => {
        if (!childData) {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
          return;
        }
        router.push({
          pathname: '/comments',
          params: { newsId: childData.id },
        });
      }}
      onRightSwipe={(childData) => {
        if (!childData) {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
          return;
        }
        router.push({
          pathname: '/news',
          params: { newsUrl: childData.url },
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
