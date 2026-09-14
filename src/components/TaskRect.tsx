import { Pressable, StyleSheet, Text, View } from 'react-native';
import {RoundedCheckbox} from './RoundedCheckbox';
import {StarCheckbox} from './StarCheckbox';
import { Task } from '../repositories/taskRepository';
import BellIcon from '../../assets/icons/bell.svg';

type TaskRectProps = {
  task: Task;
  onUpdate?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onLongPress?: (task: Task) => void;
};

export function TaskRect({ task, onUpdate, onLongPress }: TaskRectProps) {
  return (
    <View style={styles.taskRect}>
      <View style={styles.taskRectLeft}>
        <RoundedCheckbox
          size={24}
          activeColor="#4560ee"
          checked={task.isCompleted ?? false}
          onValueChange={newVal => {
            task.isCompleted = newVal;

            if (onUpdate) onUpdate(task);
          }}
        />

        <Pressable
          style={styles.taskPressable}
          onPress={() => {
            if (onLongPress) {
              onLongPress(task);
            }
          }}
        >
          <Text style={styles.taskName}>{task.name}</Text>

          {task.remindAt && (
            <BellIcon />
          )}
        </Pressable>
      </View>

      <StarCheckbox
        size={24}
        activeColor="#4560ee"
        checked={task.isFavorite ?? false}
        onValueChange={newVal => {
          task.isFavorite = newVal;

          if (onUpdate) onUpdate(task);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  taskRect: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  taskPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskName: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  taskRectLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
