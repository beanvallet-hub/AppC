import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button as ButtonNav } from '@react-navigation/elements';
import { TaskRect } from '../components/task-rect';

const tasks = [
  { id: 1, name: 'task 1', isCompleted: false, isFavorite: false, },
  { id: 2, name: 'task 2', isCompleted: false, isFavorite: false, },
  { id: 3, name: 'task 3', isCompleted: false, isFavorite: false, },
  { id: 4, name: 'task 4', isCompleted: false, isFavorite: false, },
  { id: 5, name: 'task 5', isCompleted: false, isFavorite: false, },
  { id: 6, name: 'task 6', isCompleted: false, isFavorite: false, },
  { id: 7, name: 'task 7', isCompleted: false, isFavorite: false, },
  { id: 8, name: 'task 8', isCompleted: false, isFavorite: false, },
  { id: 9, name: 'task 9', isCompleted: false, isFavorite: false, },
  { id: 10, name: 'task 10', isCompleted: false, isFavorite: false, },
  { id: 11, name: 'task 11', isCompleted: false, isFavorite: false, },
  { id: 12, name: 'task 12', isCompleted: false, isFavorite: false, },
  { id: 13, name: 'task 13', isCompleted: false, isFavorite: false, },
  { id: 14, name: 'task 14', isCompleted: false, isFavorite: false, },
  { id: 15, name: 'task 15', isCompleted: false, isFavorite: false, },
  { id: 16, name: 'task 16', isCompleted: false, isFavorite: false, },
  { id: 17, name: 'task 17', isCompleted: false, isFavorite: false, },
  { id: 18, name: 'task 18', isCompleted: false, isFavorite: false, },
];


export default function TasksScreen() {
  return (
    <View
      style={[styles.scrollView, { backgroundColor: 'white' }]}
    >
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <View style={{ flexGrow: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: 700 }}>Tasks Screen 2</Text>
            </View>

            <ButtonNav screen='Home'>Go to Home</ButtonNav>
          </View>

          <Text style={styles.centerText}>
            Saved on server
          </Text>
        </View>

        <View style={styles.sectionsWrapper}>
          <FlatList data={tasks} renderItem={({ item }) => <TaskRect task={item} />}
          />
        </View>
      </View>
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
