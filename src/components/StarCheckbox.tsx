import { Star } from 'lucide-react-native';
import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';


type StarCheckbox = PropsWithChildren & {
    initialValue?: boolean,
    onValueChange?: (newValue: boolean) => void,
    size?: number,
    activeColor?: string,
};


const StarCheckbox = ({ initialValue = false, onValueChange, size = 28, activeColor = '#007AFF' }: StarCheckbox) => {
    const [isChecked, setIsChecked] = useState(initialValue);

    const handlePress = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);

        if (onValueChange) onValueChange(newValue);
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.checkboxBase,
                {
                    width: size,
                    height: size,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    opacity: pressed ? 0.8 : 1,
                }
            ]}
        >
            {isChecked ? <Star color={activeColor} fill={activeColor} size={size * 0.8} strokeWidth={3} /> : 
             <Star color="#939393" size={size * 0.8} strokeWidth={2} />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    checkboxBase: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
});

export default StarCheckbox;
