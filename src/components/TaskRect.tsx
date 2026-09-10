import { Pressable, StyleSheet, Text, View } from 'react-native';
import {RoundedCheckbox} from './RoundedCheckbox';
import {StarCheckbox} from './StarCheckbox';
import { Task } from '../repositories/taskRepository';
import Svg, { Path } from 'react-native-svg';

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
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={'none'}
              stroke={'#939393'}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <Path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <Path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </Svg>
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
