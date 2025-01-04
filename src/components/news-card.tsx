import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_HEIGHT = SCREEN_HEIGHT;
interface NewsCardProps {
  data: any;
}
const NewsCard = ({ data }: NewsCardProps) => {
  return (
    <>
      <Image source={{ uri: data.imageUrl }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.time}>{data.time}</Text>
        <Text style={styles.content}>{data.content}</Text>
        <View style={styles.sourceContainer}>
          <Text style={styles.source}>short by {data.author}</Text>
          <Text style={styles.divider}>|</Text>
          <Text style={styles.source}>{data.source}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    height: CARD_HEIGHT * 0.4,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  contentContainer: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  time: {
    color: '#666',
    fontSize: 12,
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  source: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    marginHorizontal: 5,
    color: '#666',
  },
});

export default NewsCard;
