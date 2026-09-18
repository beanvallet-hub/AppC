import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { debounce } from '@/utils/utils';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';

const defaultValue = 'https://example.com';

export const QRCodeScreen = () => {
  const [value, setValue] = useState(defaultValue);
  const [qrValue, setQrValue] = useState(defaultValue);

  const debouncedUpdate = useCallback(
    debounce((newVal) => {
      setQrValue(newVal);
    }, 600),
    [],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate QR Code</Text>

      <TextInput
        value={value}
        onChangeText={(newVal) => {
          setValue(newVal);
          debouncedUpdate(newVal);
        }}
        placeholder="Enter text or URL"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <QRCodeGenerator containerStyles={styles.qrContainer} size={200} color={'black'} backgroundColor={'white'} value={qrValue} />

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 30,
  },

  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },

  value: {
    marginTop: 20,
    textAlign: 'center',
  },
});
