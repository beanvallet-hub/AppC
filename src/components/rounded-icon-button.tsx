import { Plus } from 'lucide-react-native';
import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';


type RoundedIconButtonProps = PropsWithChildren & {
    onPress?: () => void,
    size?: number,
};


export const RoundedIconButton = ({ onPress, size = 28, ...rest }: RoundedIconButtonProps) => {
    const handlePress = () => {
        if (onPress) onPress();
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
                    borderColor: '#D1D1D6',
                    backgroundColor: '#6080ff',
                    opacity: pressed ? 0.8 : 1,
                }
            ]}
            {...rest}
        >
            <Plus color="#FFFFFF" size={size * 0.6} strokeWidth={3} />
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

