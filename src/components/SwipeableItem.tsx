import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TaskRect } from '@/components/TaskRect';


const SWIPE_THRESHOLD = -80; 

export function SwipeableItem({ item, onDelete, onUpdate, onLongPress }) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only horizontal movement
        return (
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },

      onPanResponderMove: (_, gestureState) => {
        // Only to left
        if (gestureState.dx <= 0) {
          translateX.setValue(gestureState.dx);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: -80,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.rowContainer}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.row,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TaskRect task={item} onUpdate={onUpdate} onLongPress={onLongPress} />
      </Animated.View>
    </View>
  );
}


const styles = StyleSheet.create({
  rowContainer: {
    height: 60,
    backgroundColor: 'red',
  },

  row: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 80,
    height: 60,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
