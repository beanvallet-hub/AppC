import { PropsWithChildren, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={size * 0.9}
        height={size * 0.9}
        viewBox="0 0 24 24"
        fill={isChecked ? activeColor : 'none'}
        stroke={isChecked ? activeColor : '#939393'}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <Path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </Svg>
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
