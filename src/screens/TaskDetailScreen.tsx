import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RoundedCheckbox from '../components/RoundedCheckbox';
import StarCheckbox from '../components/StarCheckbox';
import Svg, { Path } from 'react-native-svg';
import { updateTask } from '../repositories/taskRepository';
import { useCallback, useEffect, useState } from 'react';
import {
  createReminder,
  deleteReminder,
  updateReminder,
} from '../services/reminderService';
import { debounce } from '../utils/debounce';
import DateTimePicker from '@react-native-community/datetimepicker';

const defaultDate = () => {
  const now = new Date();
  now.setHours(now.getHours() + 24);

  return now;
};

export function TaskDetailScreen({ route }) {
  const safeAreaInsets = useSafeAreaInsets();
  const [txt, setTxt] = useState('');
  const [comp, setComp] = useState(false);
  const [fav, setFav] = useState(false);

  const [timeTxt, setTimeTxt] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(defaultDate);
  const [pickerMode, setPickerMode] = useState('date');
  const [remind, setRemind] = useState(false);

  const { task } = route.params;

  useEffect(() => {
    setTxt(task.name);
    setComp(task.isCompleted);
    setFav(task.isFavorite);
    setTimeTxt(task?.remindAt ? new Date(task.remindAt).toLocaleString() : ' ');
    setDate(task?.remindAt ? new Date(task.remindAt) : defaultDate());
    setRemind(!!task?.remindAt);
  }, [task]);

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

  const handleUpdate = task => {
    updateTask(task).catch(err => {
      console.log('Error: Failed update task!');
      console.error('Error :>> ', err);
    });
  };

  const handleReminder = date => {
    if (task.remindAt) {
      updateReminder({
        id: `${task.id}`,
        title: 'Task Reminder',
        body: task.name,
        date: date,
      });
    } else {
      createReminder({
        id: `${task.id}`,
        title: 'Task Reminder',
        body: task.name,
        date: date,
      });
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (pickerMode === 'date') {
      setPickerMode('time');
    } else if (pickerMode === 'time') {
      setPickerMode('date');
      setShowDatePicker(false);

      setRemind(true);

      if (selectedDate) {
        updateTask({ ...task, remindAt: selectedDate.toISOString() }).catch(
          err => {
            console.log('Error: Failed update task!');
            console.error('Error :>> ', err);
          },
        );

        handleReminder(selectedDate);
        task.remindAt = selectedDate.toLocaleString();
      }
    }

    if (selectedDate) {
      setDate(selectedDate);
      setTimeTxt(selectedDate.toLocaleString());
    }
  };

  const debouncedUpdate = useCallback(debounce(handleUpdate, 600), []);

  return (
    <View style={[{ flex: 1, backgroundColor: 'white' }, contentPlatformStyle]}>
      <ScrollView
        style={[styles.scrollView]}
        contentContainerStyle={[styles.contentContainer]}
      >
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.title}
            value={txt}
            onChangeText={t => {
              task.name = t;
              setTxt(t);

              debouncedUpdate({ ...task, name: t });
            }}
          />
        </View>

        <View style={styles.container}>
          <Pressable
            style={styles.taskRectLeft}
            onPress={() => {
              setComp(old => !old);

              task.isCompleted = !task.isCompleted;

              debouncedUpdate(task);
            }}
          >
            <RoundedCheckbox
              size={24}
              activeColor="#4560ee"
              checked={comp}
              onValueChange={() => {
                setComp(old => !old);

                task.isCompleted = !task.isCompleted;

                debouncedUpdate(task);
              }}
            />

            <Text style={{ marginLeft: 12 }}>Completed</Text>
          </Pressable>

          <Pressable
            style={styles.taskRectLeft}
            onPress={() => {
              setFav(old => !old);

              task.isFavorite = !task.isFavorite;

              debouncedUpdate(task);
            }}
          >
            <StarCheckbox
              size={26}
              activeColor="#4560ee"
              checked={fav}
              onValueChange={() => {
                setFav(old => !old);

                task.isFavorite = !task.isFavorite;

                debouncedUpdate(task);
              }}
            />

            <Text style={{ marginLeft: 12 }}>Favourite</Text>
          </Pressable>

          <Pressable
            style={styles.taskRectLeft}
            onPress={() => {
              if (remind) {
                setRemind(false);
                setTimeTxt('');

                task.remindAt = null;

                updateTask({ ...task, remindAt: null }).catch(err => {
                  console.log('Error: Failed update task!');
                  console.error('Error :>> ', err);
                });

                deleteReminder(task.id);
              } else {
                setShowDatePicker(true);
              }
            }}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={remind ? '#4560ee' : 'none'}
              stroke={remind ? '#4560ee' : '#939393'}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <Path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <Path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </Svg>

            <Text style={{ marginLeft: 12 }}>Remind Me</Text>
          </Pressable>

          <Pressable
            style={{ marginTop: 8, paddingLeft: 40 }}
            onPress={() => {
              setShowDatePicker(true);
            }}
          >
            <Text>{timeTxt}</Text>
          </Pressable>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode={pickerMode as any}
          onValueChange={handleDateChange}
          onDismiss={() => {
            setShowDatePicker(false);
            setPickerMode('date');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
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
  taskRectLeft: {
    paddingTop: 12,
    paddingBottom: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
