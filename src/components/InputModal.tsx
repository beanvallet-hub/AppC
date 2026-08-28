import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import { Task } from '../repositories/taskRepository';
import DateTimePicker from '@react-native-community/datetimepicker';

type InputModalProps = {
  isOpen: boolean;
  initialValue: Task | null;
  setIsOpen: (value: boolean) => void;
  onClose: (task: Task | null) => void;
  onSave: (task: Task | null, newValues: Record<string, any>) => void;
};

const defaultDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 24);

    return now;
}

export function InputModal({
  isOpen,
  initialValue,
  setIsOpen,
  onClose,
  onSave,
}: InputModalProps) {
  const inputRef = useRef<TextInput>(null);
  const [inpVal, setInpVal] = useState(initialValue?.name || '');
  const [timeInpVal, setTimeInpVal] = useState(initialValue?.remindAt || '');
  const [date, setDate] = useState(defaultDate);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const { translation } = useLanguage();

  const handleClose = () => {
    inputRef.current?.blur();
    setInpVal('');
    setTimeInpVal('');
    setDate(defaultDate());
    setPickerMode('date');

    setIsOpen(false);
    onClose(initialValue);
  };

  const handleSave = () => {
    const newValues = { name: inpVal, date: date.toISOString() };

    inputRef.current?.blur();
    setInpVal('');
    setTimeInpVal('');
    setDate(defaultDate());
    setPickerMode('date');

    onSave(initialValue, newValues);
  };

  useEffect(() => {
    setInpVal(initialValue?.name || '');
    setTimeInpVal(initialValue?.remindAt ? new Date(initialValue.remindAt).toLocaleString() : '');
    setDate(initialValue?.remindAt ? new Date(initialValue.remindAt) : defaultDate());
  }, [initialValue]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (pickerMode === 'date') {
        setPickerMode('time');
    } else if (pickerMode === 'time') {
        setPickerMode('date');
        setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      setTimeInpVal(selectedDate.toLocaleString());
    }
  };

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
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{translation('inputModal.task')}</Text>

          <TextInput
            ref={inputRef}
            style={styles.input}
            onChangeText={setInpVal}
            value={inpVal}
            placeholder="task name"
            placeholderTextColor="#999999"
          />

          <TextInput
            style={styles.input}
            value={timeInpVal}
            placeholder="remind at"
            placeholderTextColor="#999999"
            onFocus={() => {
              setShowDatePicker(true);
            }}
          />

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode={pickerMode as any}
              onValueChange={handleDateChange}
              onDismiss={() => setShowDatePicker(false)}
            />
          )}

          <View style={styles.buttonView}>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={handleClose}
            >
              <Text style={styles.textStyle}>
                {translation('inputModal.cancel')}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleSave}
            >
              <Text style={styles.textStyle}>
                {translation('inputModal.save')}
              </Text>
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
    color: '#888',
  },
  buttonView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 16,
  },
  input: {
    height: 36,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    minWidth: 240,
  },
});
