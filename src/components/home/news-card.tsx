import { useQuery } from '@tanstack/react-query';
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import newsPreloader from '@/lib/preloader';
import { type News } from '@/types';

import ShimmerLoader, { ShimmerImage, ShimmerSummary } from './shimmer';

const LIST_OF_BORDER_COLORS = [
  'border-red-100',
  'border-orange-100',
  'border-yellow-100',
  'border-green-100',
  'border-blue-100',
  'border-indigo-100',
  'border-violet-100',
];

function generateRandomIndex(array: any[]) {
  if (array.length === 0) {
    throw new Error('Array cannot be empty');
  }
  return Math.floor(Math.random() * array.length);
}

interface NewsCardProps {
  newsId: number;
}

// Extract error view into a separate component
const ErrorView = ({ error }: { error: Error | null }) => (
  <View>
    <Text>{error && error.toString()}</Text>
  </View>
);

// Extract card content into a separate component
const CardContent = ({ hackerNewsData, newsData, isLoadingNewApi }: any) => (
  <>
    {isLoadingNewApi ? (
      <ShimmerImage />
    ) : (
      newsData.image_url && (
        <Image
          className="h-1/3 w-full rounded-t-2xl"
          source={{ uri: newsData.image_url }}
        />
      )
    )}
    <View className={'flex flex-1 p-4'}>
      <Text className="text-xl">{hackerNewsData?.title || 'Test title '} </Text>
      <View>
        {isLoadingNewApi ? (
          <ShimmerSummary />
        ) : (
          <Text>{newsData.summary || 'No summary available.'}</Text>
        )}
      </View>
      <View className="mt-auto flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
          <Text className="text-sm font-light">Created by: </Text>
          <Text className="text">{hackerNewsData?.by}</Text>
        </View>

        <View className="flex flex-row items-center space-x-4">
          <View className="flex flex-row items-center">
            <Text className="mr-1  text-sm font-light ">Upvotes: </Text>
            <Text>{hackerNewsData?.score || 0}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show(
                'Swipe left to view comments',
                ToastAndroid.SHORT,
              );
            }}
            className="flex flex-row items-center"
          >
            <Text className="mx-1 text-sm font-light"> Comments: </Text>
            <Text>{hackerNewsData?.descendants || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </>
);

const NewsCard = forwardRef((props: NewsCardProps, ref) => {
  const { newsId } = props;
  const {
    isLoading: isLoading,
    error: error,
    data: news,
  } = useQuery<News>({
    queryKey: [newsId],
    queryFn: () => {
      return newsPreloader.getNews(newsId);
    },
  });

  useImperativeHandle(ref, () => ({
    getData: () => news,
  }));

  if (isLoading) return <ShimmerLoader />;
  if (error) return <ErrorView error={error} />;

  return (
    <SafeAreaView
      className={`flex flex-1 gap-3 rounded-2xl border-2 bg-white ${LIST_OF_BORDER_COLORS[generateRandomIndex(LIST_OF_BORDER_COLORS)]}`}
    >
      <CardContent
        hackerNewsData={news}
        newsData={news}
        isLoadingNewApi={isLoading}
      />
    </SafeAreaView>
  );
});

export default NewsCard;
