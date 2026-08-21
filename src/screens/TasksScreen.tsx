import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, Task, updateTask } from '../repositories/tasks';
import { InputModal } from '../components/InputModal';
import { RoundedIconButton } from '../components/RoundedIconButton';
import { SwipeableItem } from '../components/SwipeableItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/useLanguage';
import Toast from 'react-native-toast-message';


export function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { translation } = useLanguage();

  useEffect(() => {
    getTasks().then((tasks) => {
      setTasks(tasks);
    }).catch((err) => {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Failed to load tasks",
        topOffset: 60
      });
    }
    );
  }, []);


  const handleSave = (newValue: string) => {
    if (activeTask) {
      activeTask.name = newValue;

      updateTask({
        ...activeTask,
        name: newValue,
      });

      setActiveTask(null);
      setModalVisible(false);
    } else {
      createTask({
        name: newValue,
        isCompleted: false,
        isFavorite: false,
      }).then((task) => {
        setTasks((tasks) => {
          const newTasks = [...tasks];
          newTasks.push(task);

          return newTasks;
        });
      }).finally(() => {
        setModalVisible(false);
      });
    }
  }

  const handleClose = () => {
    if (activeTask) {
      setActiveTask(null);
    }
  }

  const handleDelete = (task: any) => {
    deleteTask(task);

    setTasks((currTasks) => {
      return currTasks.filter((item) => item.id !== task.id);
    });
  };

  const handleLongPress = (task: any) => {
    setActiveTask(task);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.scrollView, { backgroundColor: 'white' }]}
    >
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <View style={{ flexGrow: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: 700 }}>{translation('navigation.tasks')}</Text>
            </View>

            <RoundedIconButton size={48} onPress={() => {
              setModalVisible(true);
            }} />
          </View>

          <Text style={styles.centerText}>
            {translation('taskScreen.subtitle')}
          </Text>
        </View>

        <View style={styles.sectionsWrapper}>
          <FlatList data={tasks} renderItem={({ item }) =>
            <SwipeableItem
              item={item}
              onDelete={handleDelete}
              onLongPress={handleLongPress}
              onUpdate={updateTask}
            />}
          />
        </View>
      </View>

      <InputModal isOpen={modalVisible} onSave={handleSave} onClose={handleClose} initialValue={activeTask?.name || ''} setIsOpen={setModalVisible} />
    </SafeAreaView>
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
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,

  },
  centerText: {
    textAlign: 'center',
    color: 'skyblue',
    paddingLeft: 4
  },
  sectionsWrapper: {
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 130,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1'
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
