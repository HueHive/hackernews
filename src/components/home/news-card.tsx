import { useQuery } from '@tanstack/react-query';
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type News } from '@/types';

const dummyStory = `In a quiet village, nestled between rolling 
green hills, lived a little boy named Arjun. One day, 
his grandmother handed him a small, shiny seed and said,
 "Plant this, water it every day, and watch what happens.
 In a quiet village, nestled between rolling 
green hills, lived a little boy named Arjun. One day, 
his grandmother handed him a small, shiny seed and said,
 "Plant this, water it every day, and watch what happens.
 `;
interface NewsCardProps {
  newsId: number;
}
const NewsCard = forwardRef((props: NewsCardProps, ref) => {
  const { newsId } = props;
  const {
    isLoading,
    error,
    data: news,
  } = useQuery<News>({
    queryKey: [newsId],
    queryFn: () =>
      fetch(
        `https://hacker-news.firebaseio.com//v0/item/${newsId}.json?print=pretty`,
      ).then((res) => res.json()),
  });

  useImperativeHandle(ref, () => ({
    getData: () => news,
  }));

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>{error.toString()}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className={`flex flex-1 border border-white/10 bg-white/5 backdrop-blur-sm`}
    >
      <Image
        source={{ uri: 'https://placehold.co/300x200/png' }}
        className={`h-1/3 w-full`}
      />
      <View className={'flex flex-1 p-4'}>
        <Text className="text-xl">{news?.title || 'Test title '} </Text>
        <View>
          <Text>{dummyStory}</Text>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm font-light">Create by: </Text>
          <Text className="text">{news?.by}</Text>
          <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          <Text>{'100'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
});

export default NewsCard;
