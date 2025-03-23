import LinearGradient from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient as any);

export const ShimmerImage = () => {
  return (
    <ShimmerPlaceholder
      style={{ height: '33%', width: '100%', borderRadius: 8 }}
    />
  );
};

export const ShimmerSummary = () => {
  return (
    <View className={`mt-4 flex flex-col gap-3`}>
      <ShimmerPlaceholder
        style={{ height: 30, marginTop: 16, width: '90%', borderRadius: 8 }}
      />
      <ShimmerPlaceholder
        style={{ height: 30, width: '93%', borderRadius: 8 }}
      />
      <ShimmerPlaceholder
        style={{ height: 30, width: '97%', borderRadius: 8 }}
      />
      <ShimmerPlaceholder
        style={{ height: 30, width: '91%', borderRadius: 8 }}
      />
    </View>
  );
};

const ShimmerLoader = () => {
  return (
    <View className={`flex flex-1  gap-3 rounded-2xl border border-white/10`}>
      <ShimmerImage />
      <ShimmerPlaceholder
        style={{ height: 40, width: '90%', borderTopRadis: 8 }}
      />

      <ShimmerSummary />

      <ShimmerPlaceholder
        style={{
          height: 30,
          width: '70%',
          marginTop: 'auto',
          marginBottom: 20,
          borderRadius: 8,
        }}
      />
    </View>
  );
};

export default ShimmerLoader;
