import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { QRCodeScanner } from '../components/QRCodeScanner';

export function QRScannerScreen() {
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(true);

  const handleReadCode = (value: any) => {
    if (value) {
      setScannedValue(JSON.stringify(value));
      setScannerActive(false);
    }
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner showInstructions={true} onQRScanned={handleReadCode} isActive={scannerActive} />

        {scannedValue && (!scannerActive) && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>
              Scanned value
            </Text>

            <Text style={styles.resultValue}>
              {scannedValue}
            </Text>

            <Button title="Re-Scan" onPress={() => setScannerActive(true)} /> 
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 60,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },

  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  resultValue: {
    fontSize: 16,
  },
});
