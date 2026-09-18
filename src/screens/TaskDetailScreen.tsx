import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RoundedCheckbox} from '@/components/RoundedCheckbox';
import {StarCheckbox} from '@/components/StarCheckbox';
import { Task, updateTask } from '@/repositories/taskRepository';
import { useCallback, useEffect, useState } from 'react';
import {
  createReminder,
  deleteReminder,
  updateReminder,
} from '@/services/reminderService';
import { debounce } from '@/utils/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BellIcon } from '@/components/BellIcon';

const defaultDate = () => {
  const now = new Date();

  now.setHours(now.getHours() + 24);

  return now;
};

export function TaskDetailScreen({ route }) {
  const [txt, setTxt] = useState('Task');
  const [comp, setComp] = useState(false);
  const [fav, setFav] = useState(false);

  const [timeTxt, setTimeTxt] = useState(' ');
  const [remind, setRemind] = useState(false);

  const [date, setDate] = useState(defaultDate);
  const [pickerMode, setPickerMode] = useState('date');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { task } = route.params;

  useEffect(() => {
    if (task) {
      setTxt(task.name);
      setComp(task.isCompleted);
      setFav(task.isFavorite);

      if (task.remindAt) {
        const rdate = new Date(task.remindAt);

        setTimeTxt(rdate.toLocaleString());
        setDate(rdate);
        setRemind(true);
      } else {
        setTimeTxt(' ');
        setDate(defaultDate());
        setRemind(false);
      }
    }
  }, [task]);

  const handleDateChange = useCallback(
    (event: any, pickerMode: string, task: Task, selectedDate?: Date) => {
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

          if (task.remindAt) {
            updateReminder({
              id: `${task.id}`,
              title: 'Task Reminder',
              body: task.name,
              date: selectedDate,
            });
          } else {
            createReminder({
              id: `${task.id}`,
              title: 'Task Reminder',
              body: task.name,
              date: selectedDate,
            });
          }
          task.remindAt = selectedDate.toISOString();
        }
      }

      if (selectedDate) {
        setDate(selectedDate);
        setTimeTxt(selectedDate.toLocaleString());
      }
    },
    [],
  );

  const handlePressRemind = useCallback((remind: boolean, task) => {
    if (remind) {
      setRemind(false);
      setTimeTxt(' ');

      task.remindAt = null;

      updateTask({ ...task, remindAt: null }).catch(err => {
        console.log('Error: Failed update task!');
        console.error('Error :>> ', err);
      });

      deleteReminder(task.id);
    } else {
      setShowDatePicker(true);
    }
  }, []);

  const debouncedUpdate = useCallback(
    debounce((task) => {
      updateTask(task).catch(err => {
        console.log('Error: Failed update task!');
        console.error('Error :>> ', err);
      });
    }, 600),
    [],
  );

  const handleUpdate = useCallback((task, newValue, column) => {
    task[column] = newValue;

    if (column === 'name') {
      setTxt(newValue);
    } else if (column === 'isFavorite') {
      setFav(newValue);
    } else if (column === 'isCompleted') {
      setComp(newValue);
    }

    debouncedUpdate(task);
  }, [debouncedUpdate]);

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.title}
            value={txt}
            onChangeText={t => {
              handleUpdate(task, t, 'name');
            }}
          />
        </View>

        <View style={styles.container}>
          <Pressable
            style={styles.taskRectLeft}
            onPress={() => {
              handleUpdate(task, !comp, 'isCompleted');
            }}
          >
            <RoundedCheckbox
              size={24}
              activeColor="#4560ee"
              checked={comp}
              onValueChange={() => {
                handleUpdate(task, !comp, 'isCompleted');
              }}
            />

            <Text style={styles.checkboxLabel}>Completed</Text>
          </Pressable>

          <Pressable
            style={styles.taskRectLeft}
            onPress={() => {
              handleUpdate(task, !fav, 'isFavorite');
            }}
          >
            <StarCheckbox
              size={26}
              activeColor="#4560ee"
              checked={fav}
              onValueChange={() => {
                handleUpdate(task, !fav, 'isFavorite');
              }}
            />

            <Text style={styles.checkboxLabel}>Favourite</Text>
          </Pressable>

          <Pressable
            style={styles.taskRectLeft}
            onPress={() => {
              handlePressRemind(remind, task);
            }}
          >
            <BellIcon isActive={remind} />

            <Text style={styles.checkboxLabel}>Remind Me</Text>
          </Pressable>

          <Pressable
            style={styles.reminderButton}
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
          onValueChange={(event, newDate) => {
            handleDateChange(event, pickerMode, task, newDate);
          }}
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
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
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
  checkboxLabel: {
    marginLeft: 12,
  },
  reminderButton: {
    marginTop: 8,
    paddingLeft: 40,
  },
  taskRectLeft: {
    paddingTop: 12,
    paddingBottom: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
