import React from 'react';
import LottieView from 'lottie-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

export function AnimationScreen() {
  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <LottieView
          source={require('@assets/animations/loading_bricks.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
      <View style={styles.container}>
        <LottieView
          source={require('@assets/animations/loading_bar.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },

  container: {
    // width: 300,
    // height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  animation: {
    width: 300,
    height: 300,
  },
});
