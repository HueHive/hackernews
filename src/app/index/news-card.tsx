import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
const NewsCard = ({ newsId }: NewsCardProps) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [newsId],
    queryFn: () =>
      fetch(
        `https://hacker-news.firebaseio.com//v0/item/${newsId}.json?print=pretty`,
      ).then((res) => res.json()),
  });

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
  console.log(data);

  return (
    <SafeAreaView className={`flex flex-1`}>
      <Image
        source={{ uri: 'https://via.placeholder.com/400x200' }}
        className={`h-2/5 w-full`}
      />
      <View className={'flex flex-1 p-4'}>
        <Text>{data.title} </Text>
        <View>
          <Text>{data.story || dummyStory}</Text>
        </View>
        <View className="flex flex-row items-center">
          <Text>Create by </Text>
          <Text>|</Text>
          <Text>{data.by}</Text>
          <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          <Text>{'100'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewsCard;
