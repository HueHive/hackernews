import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Image,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import newsPreloader from '@/lib/preloader';
import { type News } from '@/types';

import ShimmerLoader, { ShimmerImage, ShimmerSummary } from './shimmer';

interface Gradient {
  placeholderUri: string;
  colors: [string, string];
  start: { x: number; y: number };
  end: { x: number; y: number };
}
// Step 1: Your gradient config
const gradients: Gradient[] = [
  {
    placeholderUri: require('../../../assets/placeholders/soft_peach.png'),
    colors: ['#ffffff', '#FFE3F6'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    placeholderUri: require('../../../assets/placeholders/gentle_sky.png'),
    colors: ['#ffffff', '#E6E3FF'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  {
    placeholderUri: require('../../../assets/placeholders/aqua_breeze.png'),
    colors: ['#ffffff', '#E4E3FF'],
    start: { x: 0.1, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    placeholderUri: require('../../../assets/placeholders/mint_cream.png'),
    colors: ['#ffffff', '#FFE6E3'],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
  },
  {
    placeholderUri: require('../../../assets/placeholders/levender_mist.png'),
    colors: ['#ffffff', '#E3FFEF'],
    start: { x: 0.2, y: 0 },
    end: { x: 1, y: 1 },
  },
];

// Step 2: Choose a random gradient
const getRandomGradient = () => {
  const index = Math.floor(Math.random() * gradients.length);
  return gradients[index];
};

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
const CardContent = ({
  hackerNewsData,
  newsData,
  isLoadingNewApi,
  placeholderUri,
}: any) => {
  if (newsData.image_url === 'https://example.com/default-article-image.jpg') {
    newsData.image_url = null;
  }
  return (
    <>
      {isLoadingNewApi ? (
        <ShimmerImage />
      ) : newsData.image_url ? (
        <Image
          className="h-1/3 w-full rounded-t-2xl"
          source={{ uri: newsData.image_url }}
        />
      ) : (
        <Image className="h-1/3 w-full rounded-t-2xl" source={placeholderUri} />
      )}
      <View className={'flex flex-1 overflow-hidden p-2'}>
        <Text className="mb-2 text-2xl">
          {hackerNewsData?.title || 'Test title '}{' '}
        </Text>
        <View>
          {isLoadingNewApi ? (
            <ShimmerSummary />
          ) : (
            <Text className={'text-base'}>
              {newsData.summary || 'No summary available.'}
            </Text>
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
};

const NewsCard = forwardRef((props: NewsCardProps, ref) => {
  const { newsId } = props;
  const [randomGradient, setRandomGradient] = useState(getRandomGradient());

  useEffect(() => {
    setRandomGradient(getRandomGradient());
  }, [newsId]);

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
    <LinearGradient
      colors={randomGradient.colors}
      start={randomGradient.start}
      end={randomGradient.end}
      className={`flex flex-1 gap-3 rounded-2xl `}
      style={shadowStyle}
    >
      <CardContent
        hackerNewsData={news}
        newsData={news}
        isLoadingNewApi={isLoading}
        placeholderUri={randomGradient.placeholderUri}
      />
    </LinearGradient>
  );
});

const shadowStyle = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: -1, height: 3 },
      shadowOpacity: 0.75,
      shadowRadius: 5,
    },
    android: {
      elevation: 4,
    },
  }),
};

export default NewsCard;
