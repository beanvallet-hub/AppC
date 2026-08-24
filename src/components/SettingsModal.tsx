import { Modal, Pressable, StyleSheet, View, Text, Image } from 'react-native';
import { useLanguage } from '../i18n/useLanguage';
import { SupportedLanguage } from '../i18n/config';
import { updateAppLang } from '../repositories/application';
import Toast from 'react-native-toast-message';

type InputModalProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    onClose?: () => void;
}


export function SettingsModal({ isOpen, setIsOpen, onClose }: InputModalProps) {
    const { setLanguage, language, translation } = useLanguage();

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    const changeLanguage = (lang: SupportedLanguage) => {
        setLanguage(lang);

        updateAppLang(lang)
            .catch((err) => {
                console.log('Failed to change language!', err);

                Toast.show({
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Failed to change language",
                    position: 'bottom',
                    bottomOffset: 60
                });
            });
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isOpen}
            onRequestClose={handleClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <Text style={styles.modalText}>{translation('settings.title')}</Text>
                        </View>

                        <View style={{ position: 'absolute', top: -24, right: -20 }}>
                            <Pressable
                                onPress={handleClose}
                                style={({ pressed }) => [
                                    styles.checkboxBase,
                                    {
                                        width: 42,
                                        height: 42,
                                        borderColor: 'transparent',
                                        backgroundColor: 'transparent',
                                        opacity: pressed ? 0.8 : 1,
                                    }
                                ]}
                            >
                                <Image source={require('../../assets/icons/x.png')} style={{ width: 28, height: 28, tintColor: '#939393' }} />
                            </Pressable>
                        </View>
                    </View>

                    <View>

                        <Text style={{ fontSize: 20, fontWeight: 600 }}>{translation('settings.language')}</Text>

                        <Text style={{ fontSize: 16 }}>current: {language}</Text>


                        <View style={styles.buttonView}>
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => changeLanguage('en')}>

                                <Text style={styles.textStyle}>English</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => changeLanguage('si')}>

                                <Text style={styles.textStyle}>සිංහල</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    checkboxBase: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    centeredView: {
        marginTop: 30,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 6,
        padding: 10,
        elevation: 2,
        backgroundColor: 'white',
    },
    buttonOpen: {
        backgroundColor: '#2196F3',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 16,
        fontSize: 24,
        fontWeight: 700,
    },
    buttonView: {
        backgroundColor: 'white',
        flexDirection: 'row',
        gap: 16,
        marginTop: 16,
        marginBottom: 12
    },
    input: {
        height: 36,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 6,
        minWidth: 240
    },
});
