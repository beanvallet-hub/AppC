import { Modal, Pressable, StyleSheet, TextInput, View, Text } from 'react-native';
import { useLanguage } from '../i18n/useLanguage';
import { X } from 'lucide-react-native';

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
                                <X color="#939393" size={28} />
                            </Pressable>
                        </View>
                    </View>

                    <View>

                        <Text style={{ fontSize: 20, fontWeight: 600 }}>{translation('settings.language')}</Text>
                        
                        <Text style={{ fontSize: 16 }}>current: {language}</Text>


                        <View style={styles.buttonView}>
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setLanguage('en')}>

                                <Text style={styles.textStyle}>English</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setLanguage('si')}>

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
