import { FlatList, StyleSheet, Text, View } from 'react-native';
import { memo, useCallback, useEffect, useState } from 'react';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  Task,
  updateTask,
} from '../repositories/taskRepository';
import { InputModal } from '../components/InputModal';
import { RoundedIconButton } from '../components/RoundedIconButton';
import { SwipeableItem } from '../components/SwipeableItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/useLanguage';
import Toast from 'react-native-toast-message';
import {
  createReminder,
  deleteReminder,
  updateReminder,
} from '../services/reminderService';
import { useFocusEffect } from '@react-navigation/native';

const ITEM_HEIGHT = 60;

const ListItem = memo(SwipeableItem, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item;
});

export function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [refreshOnFocus, setRefreshOnFoucs] = useState(false);
  const [taskToRefresh, setTaskToRefresh] = useState<Task | null>(null);

  const { translation } = useLanguage();

  useEffect(() => {
    getTasks()
      .then(tasks => {
        setTasks(tasks);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Failed to load tasks',
          topOffset: 60,
        });

        console.error('Error :>> ', err);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (refreshOnFocus && taskToRefresh) {
        
        getTaskById(taskToRefresh.id)
          .then(updatedTask => {

            if (updatedTask && isActive) {
              setTasks(current =>
                current.map(task =>
                  task.id === updatedTask.id ? updatedTask : task,
                ),
              );
            }
          })
          .catch(err => {
            console.error('Error loading  updated task!', err);
          });

        setTaskToRefresh(null);
        setRefreshOnFoucs(false);
      }

      return () => {
        isActive = false;
      };
    }, [refreshOnFocus, taskToRefresh]),
  );

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

      updateTask(newTask)
        .then(task => {
          if (task.remindAt && activeTask.remindAt !== newValues.date) {
            updateReminder({
              id: `${task.id}`,
              title: 'Task Reminder',
              body: task.name,
              date: new Date(task.remindAt),
            });
          }

          return task;
        })
        .catch(err => {
          console.log('Error: Failed update task!');
          console.error('Error :>> ', err);
        });

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
        .then(task => {
          if (task.remindAt) {
            createReminder({
              id: `${task.id}`,
              title: 'Task Reminder',
              body: task.name,
              date: new Date(task.remindAt),
            });
          }

          return task;
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
    setTaskToRefresh(task);
    setRefreshOnFoucs(true);

    navigation.navigate('Task', {
      task,
    });
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
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <View style={styles.titleLabelWrapper}>
              <Text style={styles.titleText}>
                {translation('navigation.tasks')}
              </Text>
            </View>

            <RoundedIconButton
              size={48}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          </View>

          <Text style={styles.centerText}>
            {translation('taskScreen.subtitle')}
          </Text>
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
    </SafeAreaView>
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
