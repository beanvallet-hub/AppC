import { Modal, Pressable, StyleSheet, TextInput, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import { Task } from '../repositories/tasks';

type InputModalProps = {
    isOpen: boolean;
    initialValue: Task | null;
    setIsOpen: (value: boolean) => void;
    onClose: (task: Task | null) => void;
    onSave: (task: Task | null, newValue: string) => void;
}


export function InputModal({ isOpen, initialValue, setIsOpen, onClose, onSave }: InputModalProps) {
    const inputRef = useRef<TextInput>(null);
    const [inpVal, setInpVal] = useState(initialValue?.name || '');

    const { translation } = useLanguage();

    const handleClose = () => {
        inputRef.current?.blur();
        setInpVal('');

        setIsOpen(false);
        onClose(initialValue);
    };

    const handleSave = () => {
        const newValue = inpVal;
        inputRef.current?.blur();
        setInpVal('');

        onSave(initialValue, newValue);
    };

    useEffect(() => {
        setInpVal(initialValue?.name || '');
    }, [initialValue]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onShow={() => {
                requestAnimationFrame(() => {
                    inputRef.current?.focus();
                });
            }}
            onRequestClose={handleClose}>
            <KeyboardAvoidingView style={styles.centeredView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{translation('inputModal.task')}</Text>

                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        onChangeText={setInpVal}
                        value={inpVal}
                        placeholder="task name"
                    />

                    <View style={styles.buttonView}>
                        <Pressable
                            style={[styles.button, styles.buttonOpen]}
                            onPress={handleClose}>

                            <Text style={styles.textStyle}>{translation('inputModal.cancel')}</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleSave}>

                            <Text style={styles.textStyle}>{translation('inputModal.save')}</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
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
        backgroundColor: '#d1d1d1',
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
        marginBottom: 15,
        textAlign: 'center',
        color: '#888'
    },
    buttonView: {
        backgroundColor: 'white',
        flexDirection: 'row',
        gap: 16
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
