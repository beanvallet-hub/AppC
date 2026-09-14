import { PropsWithChildren, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
// import Svg, { Path } from 'react-native-svg';
import StarIcon from '../../assets/icons/star.svg';

type StarCheckbox = PropsWithChildren & {
  initialValue?: boolean;
  onValueChange?: (newValue: boolean) => void;
  size?: number;
  activeColor?: string;
  checked?: boolean;
};

export const StarCheckbox = ({
  initialValue = false,
  onValueChange,
  size = 28,
  activeColor = '#007AFF',
  checked,
}: StarCheckbox) => {
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
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <StarIcon fill={isChecked ? activeColor : 'none'} stroke={isChecked ? activeColor : '#939393'} /> 
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
