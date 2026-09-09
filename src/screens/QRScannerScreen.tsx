import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Camera } from 'react-native-camera-kit';

const QRScannerScreen = () => {
  const handleReadCode = (event: any) => {
    const value = event.nativeEvent.codeStringValue;

    if (value) {
      Alert.alert('QR Code', value);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        scanBarcode={true}
        showFrame={true}
        barcodeFrameSize={{ width: 200, height: 200 }}
        onReadCode={handleReadCode}
        allowedBarcodeTypes={['qr']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default QRScannerScreen;