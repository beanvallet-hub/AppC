import React from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet, View} from 'react-native';

export function AnimationView() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animations/loading_spinner.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  animation: {
    width: 300,
    height: 300,
  },
});
