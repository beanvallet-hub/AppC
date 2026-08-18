import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, Task, updateTask } from '../api/task.api';
import { InputModal } from '../components/InputModal';
import { RoundedIconButton } from '../components/RoundedIconButton';
import { SwipeableItem } from '../components/SwipeableItem';


export function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    getTasks().then((res) => {

      if (res.data) {
        setTasks(res.data);
      }
    }).catch((err) => {
      console.log('Error loading tasks!');
    });
  }, []);


  const handleSave = (newValue: string) => {
    if (activeTask) {
      activeTask.name = newValue;

      updateTask({
        ...activeTask,
        name: newValue,
      }).catch((err) => {
        console.log('Error creating new task!');
      });

      setActiveTask(null);
      setModalVisible(false);
    } else {
      createTask({
        name: newValue,
        isCompleted: false,
        isFavorite: false,
      }).then((res) => {

        if (res.data) {
          setTasks((tasks) => {
            const newTasks = [...tasks];
            newTasks.push(res.data);

            return newTasks;
          });
        }
      })
        .catch((err) => {
          console.log('Error creating new task!');
        })
        .finally(() => {
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
    deleteTask(task).catch((err) => {
      console.log('Error deleting task!');
    });

    setTasks((currTasks) => {
      return currTasks.filter((item) => item.id !== task.id);
    });
  };

  const handleLongPress = (task: any) => {
    setActiveTask(task);
    setModalVisible(true);
  };

  return (
    <View
      style={[styles.scrollView, { backgroundColor: 'white' }]}
    >
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <View style={{ flexGrow: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: 700 }}>Home Screen</Text>
            </View>

            <RoundedIconButton size={48} onPress={() => {
              setModalVisible(true);
            }} />
          </View>

          <Text style={styles.centerText}>
            Saved on Server
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
    </View>
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
