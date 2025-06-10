import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, ToastAndroid, View} from 'react-native';

import NewsCard from '@/components/home/news-card';
import ShimmerLoader from '@/components/home/shimmer';
import Swappable from '@/components/swappable/swappable';
import newsPreloader from '@/lib/preloader';
import { type News } from '@/types';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    data: topStories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['topStories'],
    queryFn: () =>
      fetch(
        'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
      ).then((res) => res.json()),
  });

  useEffect(() => {
    async function preloadNews() {
      if (topStories.length > 0) {
        let index = currentIndex;
        while (index < currentIndex + 3) {
          await newsPreloader.getNews(topStories[index + 1]);
          index++;
        }
      }
    }
    preloadNews();
  }, [currentIndex, topStories]);

  if (isLoading) {
    return <>
      <Stack.Screen options={{ headerShown: false }} />
      <ShimmerLoader />;
    </>
  }

  if (topStories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No data found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
            params: { newsUrl: childData.article_url },
          });
        }}
        onTopSwipe={() => {
          setCurrentIndex(currentIndex + 1);
        }}
        onBottomSwipe={() => {
          setCurrentIndex(Math.max(currentIndex - 1, 0));
        }}
        className="flex-1 p-2"
      >
        <NewsCard  newsId={topStories[currentIndex]} />
      </Swappable>
    </>


  );
}
