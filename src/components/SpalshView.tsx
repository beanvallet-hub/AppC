import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

export function SpalshView() {
  return (
    <View style={styles.container}>
      <Image source={require('@assets/images/splash_logo.png')} width={128} height={128} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#145646'
  },
});
