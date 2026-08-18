import { Check } from 'lucide-react-native';
import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';


type RoundedCheckbox = PropsWithChildren & {
    initialValue?: boolean,
    onValueChange?: (newValue: boolean) => void,
    size?: number,
    activeColor: string,
};


const RoundedCheckbox = ({ initialValue = false, onValueChange, size = 28, activeColor = '#007AFF' }: RoundedCheckbox) => {
    const [isChecked, setIsChecked] = useState(Boolean(initialValue));

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
                    borderRadius: size / 2,
                    borderColor: isChecked ? activeColor : '#D1D1D6',
                    backgroundColor: isChecked ? activeColor : 'transparent',
                    opacity: pressed ? 0.8 : 1,
                }
            ]}
        >
            {isChecked && <Check color="#FFFFFF" size={size * 0.6} strokeWidth={3} />}
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

export default RoundedCheckbox;
