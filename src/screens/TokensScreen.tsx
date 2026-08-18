import { Button, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { getSecureItem, setSecureItem } from '../utils/keychain';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

async function save(key: string, value: string) {
  await setSecureItem(key, value);

  alert('Your value saved');

}

async function getValueFor(key: string) {
  let result = await getSecureItem(key);

  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}


export default function TokensScreen() {
  const [key, onChangeKey] = useState('');
  const [value, onChangeValue] = useState('');

  const safeAreaInsets = useSafeAreaInsets();

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + 130,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: 24,
      paddingBottom: 16,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView]}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Secure Store</Text>
          <Text style={styles.centerText} >
            Store your values securely.
          </Text>
        </View>

        <View style={styles.sectionsWrapper}>
          <View style={styles.container}>
            <Text style={styles.paragraph}>Save an item</Text>

            <TextInput
              style={styles.textInput}
              onChangeText={(val) => onChangeKey(val)}
              placeholder="Enter the key"
              value={key}
              placeholderTextColor="#999999"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={val => {
                onChangeValue(val);
              }}
              placeholder="Enter the value"
              value={value}
              placeholderTextColor="#999999"
            />

            <View
              style={{ marginTop: 8 }}>

              <Button
                title="Save this key/value pair"

                onPress={() => {
                  save(key, value);
                  onChangeKey('');
                  onChangeValue('');
                }}
              />
            </View>

            <Text style={styles.paragraph}>Enter your key</Text>
            <TextInput
              style={styles.textInput}
              onSubmitEditing={event => {
                getValueFor(event.nativeEvent.text);
              }}
              placeholderTextColor="#999999"
              placeholder="Enter the key for the value you want to get"
            />
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
  },
  titleContainer: {
    gap: 12,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 700
  },
  centerText: {
    textAlign: 'center',
    color: 'skyblue'
  },
  sectionsWrapper: {
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  paragraph: {
    marginTop: 34,
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 0.5,
    padding: 4,
    marginTop: 8,
    borderRadius: 4,
    color: 'black'
  },
});
