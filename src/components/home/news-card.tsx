import { useQuery } from '@tanstack/react-query';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <View className="mt-auto flex flex-row items-center">
        <Text className="text-sm font-light">Created by: </Text>
        <Text className="text">{hackerNewsData?.by}</Text>
        <TouchableOpacity onPress={() => {}}></TouchableOpacity>
        <Text>{'100'}</Text>
      </View>
    </View>
  </>
);

const NewsCard = forwardRef((props: NewsCardProps, ref) => {
  const { newsId } = props;
  const {
    isLoading: isLoadingHackerNews,
    error: errorHackerNews,
    data: hackerNewsData,
  } = useQuery<News>({
    queryKey: [newsId],
    queryFn: () =>
      fetch(
        `https://hacker-news.firebaseio.com/v0/item/${newsId}.json?print=pretty`,
      ).then((res) => res.json()),
  });

  const {
    isLoading: isLoadingNewApi,
    error: errorNewApi,
    data: newsData,
  } = useQuery({
    queryKey: [hackerNewsData],
    queryFn: () => {
      if (!hackerNewsData) return null;
      return fetch(
        `https://huehive.co/api/v1/hn_article_summaries/summarize?hn_id=${hackerNewsData.id}&article_url=${hackerNewsData.url}&title=${hackerNewsData.title}&author=${hackerNewsData.by}&score=${hackerNewsData.score}`,
      ).then((res) => res.json());
    },
  });

  useImperativeHandle(ref, () => ({
    getData: () => newsData,
  }));

  if (isLoadingHackerNews) return <ShimmerLoader />;
  if (errorHackerNews || errorNewApi)
    return <ErrorView error={errorHackerNews || errorNewApi} />;

  return (
    <SafeAreaView
      className={`flex flex-1 gap-3 rounded-2xl border-2 ${LIST_OF_BORDER_COLORS[generateRandomIndex(LIST_OF_BORDER_COLORS)]}`}
    >
      <CardContent
        hackerNewsData={hackerNewsData}
        newsData={newsData}
        isLoadingNewApi={isLoadingNewApi}
      />
    </SafeAreaView>
  );
});

export default NewsCard;
