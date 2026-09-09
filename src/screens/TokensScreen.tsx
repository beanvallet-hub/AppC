import {
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useState } from 'react';
import { getSecureItem, setSecureItem } from '../utils/keychain';
import { SettingsModal } from '../components/SettingsModal';
import { useLanguage } from '../i18n/useLanguage';
import Toast from 'react-native-toast-message';
import Svg, { Circle } from 'react-native-svg';
import { pushService } from '../services/PushService';

async function save(key: string, value: string) {
  await setSecureItem(key, value);

  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: 'Value saved',
  });
}

async function getValueFor(key: string) {
  let result = await getSecureItem(key);

  if (result) {
    Toast.show({
      type: 'success',
      text1: 'Your value: ' + result,
      text2: 'Found',
      position: 'bottom',
      bottomOffset: 80,
      autoHide: false,
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Not Found',
      text2: 'No values stored under that key',
      position: 'bottom',
      bottomOffset: 80,
    });
  }
}

export default function TokensScreen() {
  const [key, onChangeKey] = useState('');
  const [value, onChangeValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { translation } = useLanguage();


  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                {translation('settingScreen.title')}
              </Text>

              <Pressable
                onPress={() => {
                  setIsModalOpen(true);
                }}
                style={({ pressed }) => [
                  styles.checkboxBase,
                  styles.menuButton,
                  pressed && styles.menuButtonPressed,
                ]}
              >
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <Circle cx="12" cy="12" r="2" />
                  <Circle cx="12" cy="5" r="2" />
                  <Circle cx="12" cy="19" r="2" />
                </Svg>
              </Pressable>
            </View>

            <Text style={styles.centerText}>
              {translation('settingScreen.subtitle')}
            </Text>
          </View>

          <View style={styles.sectionsWrapper}>
            <View style={styles.container}>
              <Text style={styles.paragraph}>
                {translation('settingScreen.saveItmTitle')}
              </Text>

              <TextInput
                style={styles.textInput}
                onChangeText={val => onChangeKey(val)}
                placeholder={translation('settingScreen.enterKey')}
                value={key}
                placeholderTextColor="#999999"
              />

              <TextInput
                style={styles.textInput}
                onChangeText={val => {
                  onChangeValue(val);
                }}
                placeholder={translation('settingScreen.enterValue')}
                value={value}
                placeholderTextColor="#999999"
              />

              <View style={styles.buttonWrapper}>
                <Button
                  title={translation('settingScreen.saveBtnTxt')}
                  onPress={() => {
                    save(key, value);
                    onChangeKey('');
                    onChangeValue('');
                  }}
                />
              </View>

              <Text style={styles.paragraph}>
                {translation('settingScreen.retrieveTitle')}
              </Text>

              <TextInput
                style={styles.textInput}
                onSubmitEditing={event => {
                  getValueFor(event.nativeEvent.text);
                }}
                placeholderTextColor="#999999"
                placeholder={translation('settingScreen.retrieveBtnTxt')}
              />
            </View>
          </View>

          <View style={styles.fcmBtn}>
            <Button
              onPress={() => {
                pushService.getToken().then(token => {
                  Toast.show({
                    type: 'info',
                    text1: 'Device Token',
                    text2: token ?? '',
                    position: 'bottom',
                    bottomOffset: 60,
                  });
                });
              }}
              title="Get Push Service Token"
            />
          </View>
        </View>
      </ScrollView>

      <SettingsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  titleContainer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
  },
  centerText: {
    color: 'skyblue',
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
    color: 'black',
  },
  buttonWrapper: {
    marginTop: 8,
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxBase: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  menuButton: {
    width: 32,
    height: 32,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  menuButtonPressed: {
    opacity: 0.8,
  },
  fcmBtn: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 32,
    paddingBottom: 32,
  },
});
