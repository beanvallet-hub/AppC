import { FlatList, StyleSheet, Text, View } from 'react-native';
import { memo, useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, Task, updateTask } from '@/api';
import { InputModal, RoundedIconButton, SwipeableItem } from '@/components';
import { useLanguage } from '@/i18n';
import Toast from 'react-native-toast-message';
import { createReminder, deleteReminder, updateReminder } from '@/services';

const ITEM_HEIGHT = 60;

const ListItem = memo(SwipeableItem, (prevProps, nextProps) => {
  return prevProps.item.name === nextProps.item.name;
});

export function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { translation } = useLanguage();

  useEffect(() => {
    getTasks()
      .then(res => {
        if (res.data) {
          setTasks(res.data);
        }
      })
      .catch(err => {
        console.log('Error loading tasks!', err);

        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Failed to load tasks',
          position: 'bottom',
          bottomOffset: 60,
        });
      });
  }, []);

  const handleSave = (
    activeTask: Task | null,
    newValues: Record<string, any>,
  ) => {
    if (activeTask) {
      const newTask = {
        ...activeTask,
        name: newValues.name,
        remindAt: newValues.date,
      };

      updateTask(newTask).catch(err => {
        console.log('Error: Failed update task!');
        console.error('Error :>> ', err);
      });

      if (newValues.date && activeTask.remindAt !== newValues.date) {
        updateReminder({
          id: `${newTask.id}`,
          title: 'Task Reminder',
          body: newTask.name,
          date: new Date(newTask.remindAt),
        });
      }

      setTasks(tasks => {
        const newTasks = tasks.map(task => {
          if (task.id === activeTask.id) {
            return newTask;
          } else {
            return task;
          }
        });

        return newTasks;
      });

      setActiveTask(null);
      setModalVisible(false);
    } else {
      const taskData = {
        name: newValues.name,
        isCompleted: false,
        isFavorite: false,
        remindAt: newValues.date,
      };

      createTask(taskData)
        .then(res => {
          if (res && res.data.remindAt) {
            const task = res.data;

            createReminder({
              id: `${task.id}`,
              title: 'Task Reminder',
              body: task.name,
              date: new Date(task.remindAt || ''),
            });

            return task;
          }
        })
        .then(task => {
          if (task) {
            setTasks(tasks => {
              const newTasks = [...tasks];
              newTasks.push(task);

              return newTasks;
            });
          }

          setModalVisible(false);
        })
        .catch(err => {
          console.log('Error creating new task!');
          setModalVisible(false);

          console.error('Error :>> ', err);
        });
    }
  };

  const handleClose = (activeTask: Task | null) => {
    if (activeTask) {
      setActiveTask(null);
    }
  };

  const handleDelete = (task: any) => {
    deleteTask(task).catch(err => {
      console.log('Error: Failed to delete task!');
      console.error('Error :>> ', err);
    });

    deleteReminder(task.id).catch(err => {
      console.log('Error: Failed to delete reminder!');
      console.error('Error :>> ', err);
    });

    setTasks(currTasks => {
      return currTasks.filter(item => item.id !== task.id);
    });

    Toast.show({
      type: 'info',
      text1: 'Deleted',
      text2: 'Task Deleted',
      position: 'bottom',
      bottomOffset: 60,
    });
  };

  const handleLongPress = (task: any) => {
    setActiveTask(task);
    setModalVisible(true);
  };

  const renderItem = useCallback(
    ({ item }: any) => (
      <ListItem
        key={item.id}
        item={item}
        onDelete={handleDelete}
        onLongPress={handleLongPress}
        onUpdate={updateTask}
      />
    ),
    [],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <View style={styles.titleLabelWrapper}>
              <Text style={styles.titleText}>
                {translation('navigation.home')}
              </Text>
            </View>

            <RoundedIconButton
              size={48}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          </View>

          <Text style={styles.centerText}>{translation('home.subtitle')}</Text>
        </View>

        <View style={styles.sectionsWrapper}>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
        </View>
      </View>

      <InputModal
        isOpen={modalVisible}
        onSave={handleSave}
        onClose={handleClose}
        initialValue={activeTask}
        setIsOpen={setModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flexGrow: 1,
  },
  titleContainer: {
    gap: 12,
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  titleLabelWrapper: {
    flexGrow: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 700,
  },
  centerText: {
    textAlign: 'center',
    color: 'skyblue',
    paddingLeft: 4,
  },
  sectionsWrapper: {
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 130,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
