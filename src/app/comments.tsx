import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Comments() {
  const { newsId } = useLocalSearchParams();

  if (!newsId) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const commentsUrl = `https://news.ycombinator.com/item?id=${newsId}`;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: commentsUrl }}
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
