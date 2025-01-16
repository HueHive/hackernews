import React from 'react';
import { Text, View } from 'react-native';

import { cleanup, screen, setup } from '@/lib/test-utils';

import Swappable from './swappable';

afterEach(cleanup);

// eslint-disable-next-line max-lines-per-function
describe('Swappable component ', () => {
  it('renders correctly', async () => {
    const onRightSwipe = jest.fn();
    const onLeftSwipe = jest.fn();
    const onTopSwipe = jest.fn();
    const onBottomSwipe = jest.fn();
    setup(
      <Swappable
        onLeftSwipe={onLeftSwipe}
        onRightSwipe={onRightSwipe}
        onTopSwipe={onTopSwipe}
        onBottomSwipe={onBottomSwipe}
      >
        {' '}
        <View>
          <Text> Hey init text</Text>
        </View>
      </Swappable>,
    );
    expect(await screen.findByText('Hey init text')).toBeOnTheScreen();
  });
});
