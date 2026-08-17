import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import RoundedCheckbox from './rounded-checkbox';
import StarCheckbox from './star-checkbox';
// import { Task } from '@/repositories/tasks';
// import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";


export type Task = {
    id: number;
    name: string;
    isCompleted: boolean;
    isFavorite: boolean;
};


type TaskRectProps = {
    task: Task;
    onUpdate?: (task: Task) => void;
    onDelete?: (task: Task) => void;
    handleLongPress?: (task: Task) => void;
};

export function TaskRect({ task, onUpdate, handleLongPress, onDelete }: TaskRectProps) {
    const renderDeleteAction = () => {
        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => {
                    if (onDelete)
                        onDelete(task)
                }}
            >
                <Text style={styles.deleteText}>
                    Delete
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        // <Swipeable
        //     renderLeftActions={renderDeleteAction}
        //     renderRightActions={renderDeleteAction}
        //     rightThreshold={40}
        //     leftThreshold={40}
        // >
            <View style={styles.taskRect}>
                <View style={styles.taskRectLeft}>
                    <RoundedCheckbox
                        size={24}
                        activeColor='#4560ee'
                        initialValue={task.isCompleted ?? false}
                        onValueChange={(newVal) => {
                            task.isCompleted = newVal;

                            if (onUpdate) onUpdate(task);
                        }}
                    />

                    <Pressable onLongPress={() => {
                        if (handleLongPress) {
                            handleLongPress(task);
                        }
                    }}>
                        <Text style={styles.taskName}>{task.name}</Text>
                    </Pressable>
                </View>

                <StarCheckbox
                    size={24}
                    activeColor='#4560ee'
                    initialValue={task.isFavorite ?? false}
                    onValueChange={(newVal) => {
                        task.isFavorite = newVal;

                        if (onUpdate) onUpdate(task);
                    }}
                />
            </View>
        // </Swipeable>
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
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1'
    },
    taskName: {
        paddingLeft: 16,
    },
    taskRectLeft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    deleteAction: {
        width: 100,
        backgroundColor: "#ff3b30",
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1' 
    },
    deleteText: {
        color: "white",
        fontWeight: "600",
    },
});

