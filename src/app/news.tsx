import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function News() {
  const { newsUrl } = useLocalSearchParams();

  if (!newsUrl) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: newsUrl }}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loader} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
