import { PropsWithChildren, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

type RoundedCheckbox = PropsWithChildren & {
  checked?: boolean;
  initialValue?: boolean;
  onValueChange?: (newValue: boolean) => void;
  size?: number;
  activeColor: string;
};

const RoundedCheckbox = ({
  initialValue = false,
  onValueChange,
  size = 28,
  activeColor = '#007AFF',
  checked
}: RoundedCheckbox) => {
  const [isChecked, setIsChecked] = useState(checked ?? Boolean(initialValue));

  const handlePress = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);

    if (onValueChange) onValueChange(newValue);
  };

  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

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
        },
      ]}
    >
      {isChecked && (
        <Image
          width={size * 0.6}
          height={size * 0.6}
          style={{
            tintColor: '#ffffff',
            width: size * 0.6,
            height: size * 0.6,
          }}
          source={require('../../assets/icons/check.png')}
        />
      )}
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
