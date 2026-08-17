import { Modal, Pressable, StyleSheet, TextInput, View, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';

type InputModalProps = {
    isOpen: boolean; 
    initialValue: string; 
    setIsOpen: (value: boolean) => void; 
    onClose: () => void; 
    onSave: (newValue: string) => void;
}


export function InputModal({ isOpen, initialValue, setIsOpen, onClose, onSave }: InputModalProps) {
    const inputRef = useRef<TextInput>(null);
    const [inpVal, setInpVal] = useState(initialValue);

    const handleClose = () => {
        inputRef.current?.blur();
        setInpVal('');

        setIsOpen(false);
        onClose();
    };

    const handleSave = () => {
        const newValue = inpVal;
        inputRef.current?.blur();
        setInpVal('');

        // setIsOpen(false);
        onSave(newValue);
    };

    useEffect(() => {
        setInpVal(initialValue);
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
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Task</Text>

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

                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleSave}>

                            <Text style={styles.textStyle}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
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
