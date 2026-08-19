import { Button, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { getSecureItem, setSecureItem } from '../utils/keychain';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EllipsisVertical } from 'lucide-react-native';
import { SettingsModal } from '../components/SettingsModal';
import { useLanguage } from '../i18n/useLanguage';


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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const safeAreaInsets = useSafeAreaInsets();
  const { translation } = useLanguage();
  
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
    <View style={[{ flex: 1, backgroundColor: 'white' }, contentPlatformStyle]}>
      <ScrollView
        style={[styles.scrollView]}
        contentContainerStyle={[styles.contentContainer]}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{translation('settingScreen.title')}</Text>

              <Pressable
                onPress={() => {
                  setIsModalOpen(true);
                }}
                style={({ pressed }) => [
                  styles.checkboxBase,
                  {
                    width: 32,
                    height: 32,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <EllipsisVertical color="#939393" size={32} />
              </Pressable>
            </View>

            <Text style={styles.centerText} >
              {translation('settingScreen.subtitle')}
            </Text>
          </View>

          <View style={styles.sectionsWrapper}>
            <View style={styles.container}>
              <Text style={styles.paragraph}>{translation('settingScreen.saveItmTitle')}</Text>

              <TextInput
                style={styles.textInput}
                onChangeText={(val) => onChangeKey(val)}
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

              <View style={{ marginTop: 8 }}>
                <Button
                  title={translation('settingScreen.saveBtnTxt')}

                  onPress={() => {
                    save(key, value);
                    onChangeKey('');
                    onChangeValue('');
                  }}
                />
              </View>

              <Text style={styles.paragraph}>{translation('settingScreen.retrieveTitle')}</Text>

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
        </View>

      </ScrollView>

      <SettingsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onClose={() => { }} />
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 700
  },
  centerText: {
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
});
